import { beforeEach, describe, expect, jest, test } from '@jest/globals';

const redisSet = jest.fn();

const User = {
  exists: jest.fn(),
  create: jest.fn(),
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
    hash: jest.fn().mockResolvedValue('hashed-password'),
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
const { signupUser } = await import('../../src/modules/auth/auth.service.js');

describe('signupUser', () => {
  beforeEach(() => {
    process.env.ACCESS_SECRET = 'test-access-secret';
    delete process.env.JWT_SECRET;

    User.exists.mockReset();
    User.create.mockReset();
    redisSet.mockReset();
    bcrypt.hash.mockClear();
    jwt.sign.mockClear();
  });

  test('creates a user and returns public user data with tokens', async () => {
    User.exists.mockResolvedValue(null);
    User.create.mockResolvedValue({
      _id: { toString: () => 'user-1' },
      name: 'Ajeya',
      email: 'ajeya@example.com',
      role: 'pm',
      createdAt: new Date('2026-05-02T00:00:00.000Z'),
    });

    const result = await signupUser({
      name: 'Ajeya',
      email: 'ajeya@example.com',
      password: 'password123',
    });

    expect(User.exists).toHaveBeenCalledWith({ email: 'ajeya@example.com' });
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 12);
    expect(User.create).toHaveBeenCalledWith({
      name: 'Ajeya',
      email: 'ajeya@example.com',
      passwordHash: 'hashed-password',
    });
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
        createdAt: new Date('2026-05-02T00:00:00.000Z'),
      },
      tokens: {
        accessToken: 'access-token',
        refreshToken: expect.any(String),
      },
    });
  });

  test('throws when email is already registered', async () => {
    User.exists.mockResolvedValue({ _id: 'existing-user' });

    await expect(
      signupUser({
        name: 'Ajeya',
        email: 'ajeya@example.com',
        password: 'password123',
      }),
    ).rejects.toMatchObject({
      statusCode: 409,
      code: 'EMAIL_ALREADY_REGISTERED',
    });

    expect(User.create).not.toHaveBeenCalled();
    expect(redisSet).not.toHaveBeenCalled();
  });
});
