import { beforeEach, describe, expect, jest, test } from '@jest/globals';

const redisSet = jest.fn();
const select = jest.fn();

const User = {
  findOne: jest.fn(() => ({ select })),
};

jest.unstable_mockModule('../../src/modules/auth/user.model.js', () => ({
  User,
}));

jest.unstable_mockModule('../../src/config/redis.config.js', () => ({
  getRedisClient: () => ({
    set: redisSet,
  }),
}));

jest.unstable_mockModule('bcrypt', () => ({
  default: {
    hash: jest.fn(),
    compare: jest.fn(),
  },
}));

jest.unstable_mockModule('jsonwebtoken', () => ({
  default: {
    sign: jest.fn().mockReturnValue('access-token'),
  },
}));

const bcrypt = (await import('bcrypt')).default;
const jwt = (await import('jsonwebtoken')).default;
const { loginUser } = await import('../../src/modules/auth/auth.service.js');

describe('loginUser', () => {
  beforeEach(() => {
    process.env.ACCESS_SECRET = 'test-access-secret';
    delete process.env.JWT_SECRET;

    User.findOne.mockClear();
    select.mockReset();
    redisSet.mockReset();
    bcrypt.compare.mockReset();
    jwt.sign.mockClear();
  });

  test('logs in a valid user and returns public user data with tokens', async () => {
    const createdAt = new Date('2026-05-02T00:00:00.000Z');

    select.mockResolvedValue({
      _id: { toString: () => 'user-1' },
      name: 'Ajeya',
      email: 'ajeya@example.com',
      role: 'pm',
      passwordHash: 'hashed-password',
      createdAt,
    });
    bcrypt.compare.mockResolvedValue(true);

    const result = await loginUser({
      email: 'ajeya@example.com',
      password: 'password123',
    });

    expect(User.findOne).toHaveBeenCalledWith({ email: 'ajeya@example.com' });
    expect(select).toHaveBeenCalledWith('+passwordHash');
    expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed-password');
    expect(jwt.sign).toHaveBeenCalledWith(
      {
        id: 'user-1',
        name: 'Ajeya',
        email: 'ajeya@example.com',
        role: 'pm',
      },
      'test-access-secret',
      { expiresIn: '15m' },
    );
    expect(redisSet).toHaveBeenCalledWith(
      expect.stringMatching(/^refresh:/),
      'user-1',
      'EX',
      7 * 24 * 60 * 60,
    );
    expect(result).toEqual({
      user: {
        id: 'user-1',
        name: 'Ajeya',
        email: 'ajeya@example.com',
        role: 'pm',
        createdAt,
      },
      tokens: {
        accessToken: 'access-token',
        refreshToken: expect.any(String),
      },
    });
  });

  test('throws when user is not found', async () => {
    select.mockResolvedValue(null);

    await expect(
      loginUser({
        email: 'missing@example.com',
        password: 'password123',
      }),
    ).rejects.toMatchObject({
      statusCode: 401,
      code: 'INVALID_CREDENTIALS',
    });

    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(redisSet).not.toHaveBeenCalled();
  });

  test('throws when password is invalid', async () => {
    select.mockResolvedValue({
      _id: { toString: () => 'user-1' },
      name: 'Ajeya',
      email: 'ajeya@example.com',
      role: 'pm',
      passwordHash: 'hashed-password',
      createdAt: new Date('2026-05-02T00:00:00.000Z'),
    });
    bcrypt.compare.mockResolvedValue(false);

    await expect(
      loginUser({
        email: 'ajeya@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toMatchObject({
      statusCode: 401,
      code: 'INVALID_CREDENTIALS',
    });

    expect(redisSet).not.toHaveBeenCalled();
  });
});
