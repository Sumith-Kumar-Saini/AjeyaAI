import { beforeEach, describe, expect, jest, test } from '@jest/globals';

const redisGet = jest.fn();

const User = {
  exists: jest.fn(),
};

jest.unstable_mockModule('../../src/modules/auth/user.model.js', () => ({
  User,
}));

jest.unstable_mockModule('../../src/config/redis.config.js', () => ({
  getRedisClient: () => ({
    get: redisGet,
  }),
}));

jest.unstable_mockModule('jsonwebtoken', () => ({
  default: {
    verify: jest.fn(),
  },
}));

const jwt = (await import('jsonwebtoken')).default;
const { authMiddleware } = await import('../../src/middleware/auth.middleware.js');

const createReq = ({ token = 'access-token' } = {}) => ({
  get: jest.fn((header) => {
    if (header === 'authorization') {
      return `Bearer ${token}`;
    }

    return undefined;
  }),
});

describe('authMiddleware', () => {
  beforeEach(() => {
    process.env.ACCESS_SECRET = 'test-access-secret';
    delete process.env.JWT_SECRET;

    redisGet.mockReset();
    User.exists.mockReset();
    jwt.verify.mockReset();
  });

  test('continues when token is valid and user exists in database', async () => {
    const req = createReq();
    const next = jest.fn();

    jwt.verify.mockReturnValue({ id: 'user-1', email: 'ajeya@example.com' });
    redisGet.mockResolvedValue(null);
    User.exists.mockResolvedValue({ _id: 'user-1' });

    await authMiddleware(req, {}, next);

    expect(jwt.verify).toHaveBeenCalledWith('access-token', 'test-access-secret');
    expect(redisGet).toHaveBeenCalledWith('blacklist:access:access-token');
    expect(User.exists).toHaveBeenCalledWith({ _id: 'user-1' });
    expect(req.user).toEqual({ id: 'user-1', email: 'ajeya@example.com' });
    expect(next).toHaveBeenCalledWith();
  });

  test('rejects when token user is not found in database', async () => {
    const req = createReq();
    const next = jest.fn();

    jwt.verify.mockReturnValue({ id: 'missing-user', email: 'missing@example.com' });
    redisGet.mockResolvedValue(null);
    User.exists.mockResolvedValue(null);

    await authMiddleware(req, {}, next);

    expect(User.exists).toHaveBeenCalledWith({ _id: 'missing-user' });
    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      message: 'User not found',
      statusCode: 401,
      code: 'USER_NOT_FOUND',
    }));
  });
});
