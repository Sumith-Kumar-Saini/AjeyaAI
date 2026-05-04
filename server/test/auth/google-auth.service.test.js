import { beforeEach, describe, expect, jest, test } from '@jest/globals';

const redisSet = jest.fn();

const User = {
  findOne: jest.fn(),
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
    hash: jest.fn(),
    compare: jest.fn(),
  },
}));

jest.unstable_mockModule('jsonwebtoken', () => ({
  default: {
    sign: jest.fn().mockReturnValue('access-token'),
  },
}));

const jwt = (await import('jsonwebtoken')).default;
const { googleAuthUser } = await import('../../src/modules/auth/auth.service.js');

describe('googleAuthUser', () => {
  beforeEach(() => {
    process.env.ACCESS_SECRET = 'test-access-secret';
    delete process.env.JWT_SECRET;

    User.findOne.mockReset();
    User.create.mockReset();
    redisSet.mockReset();
    jwt.sign.mockClear();
  });

  test('creates a Google user and returns tokens', async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({
      _id: { toString: () => 'user-1' },
      name: 'Ajeya',
      email: 'ajeya@example.com',
      role: 'User',
      authProvider: 'google',
      googleId: 'google-1',
      avatarUrl: 'https://example.com/avatar.png',
      emailVerified: true,
      createdAt: new Date('2026-05-03T00:00:00.000Z'),
    });

    const result = await googleAuthUser({
      googleId: 'google-1',
      email: 'Ajeya@Example.com',
      name: 'Ajeya',
      avatarUrl: 'https://example.com/avatar.png',
      emailVerified: true,
    });

    expect(User.findOne).toHaveBeenCalledWith({
      $or: [{ googleId: 'google-1' }, { email: 'ajeya@example.com' }],
    });
    expect(User.create).toHaveBeenCalledWith({
      name: 'Ajeya',
      email: 'ajeya@example.com',
      authProvider: 'google',
      googleId: 'google-1',
      avatarUrl: 'https://example.com/avatar.png',
      emailVerified: true,
    });
    expect(jwt.sign).toHaveBeenCalledWith(
      {
        id: 'user-1',
        name: 'Ajeya',
        email: 'ajeya@example.com',
        role: 'User',
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
        role: 'User',
        createdAt: new Date('2026-05-03T00:00:00.000Z'),
      },
      tokens: {
        accessToken: 'access-token',
        refreshToken: expect.any(String),
      },
    });
  });

  test('links an existing email account to Google', async () => {
    const save = jest.fn();
    const existingUser = {
      _id: { toString: () => 'user-1' },
      name: 'Ajeya',
      email: 'ajeya@example.com',
      role: 'User',
      authProvider: 'local',
      googleId: undefined,
      avatarUrl: '',
      emailVerified: false,
      createdAt: new Date('2026-05-03T00:00:00.000Z'),
      save,
    };

    User.findOne.mockResolvedValue(existingUser);

    await googleAuthUser({
      googleId: 'google-1',
      email: 'ajeya@example.com',
      name: 'Ajeya',
      avatarUrl: 'https://example.com/avatar.png',
      emailVerified: true,
    });

    expect(existingUser.googleId).toBe('google-1');
    expect(existingUser.authProvider).toBe('google');
    expect(existingUser.avatarUrl).toBe('https://example.com/avatar.png');
    expect(existingUser.emailVerified).toBe(true);
    expect(save).toHaveBeenCalled();
    expect(User.create).not.toHaveBeenCalled();
  });
});
