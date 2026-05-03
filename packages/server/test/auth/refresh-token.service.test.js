import crypto from 'crypto';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';

const redisGet = jest.fn();
const redisDel = jest.fn();
const redisSet = jest.fn();

const User = {
  findById: jest.fn(),
};

jest.unstable_mockModule('../../src/modules/auth/user.model.js', () => ({
  User,
}));

jest.unstable_mockModule('../../src/config/redis.config.js', () => ({
  getRedisClient: () => ({
    get: redisGet,
    del: redisDel,
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
    sign: jest.fn().mockReturnValue('new-access-token'),
  },
}));

const jwt = (await import('jsonwebtoken')).default;
const { refreshUserTokens } = await import('../../src/modules/auth/auth.service.js');

describe('refreshUserTokens', () => {
  beforeEach(() => {
    process.env.ACCESS_SECRET = 'test-access-secret';
    delete process.env.JWT_SECRET;

    redisGet.mockReset();
    redisDel.mockReset();
    redisSet.mockReset();
    User.findById.mockReset();
    jwt.sign.mockClear();
  });

  test('rotates a valid refresh token and returns new tokens', async () => {
    const refreshToken = 'old-refresh-token';
    const hashedRefreshToken = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');
    const createdAt = new Date('2026-05-02T00:00:00.000Z');

    redisGet.mockResolvedValue('user-1');
    User.findById.mockResolvedValue({
      _id: { toString: () => 'user-1' },
      name: 'Ajeya',
      email: 'ajeya@example.com',
      role: 'pm',
      createdAt,
    });

    const result = await refreshUserTokens(refreshToken);

    expect(redisGet).toHaveBeenCalledWith(`refresh:${hashedRefreshToken}`);
    expect(redisDel).toHaveBeenCalledWith(`refresh:${hashedRefreshToken}`);
    expect(User.findById).toHaveBeenCalledWith('user-1');
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
        accessToken: 'new-access-token',
        refreshToken: expect.any(String),
      },
    });
  });

  test('throws when refresh token is missing', async () => {
    await expect(refreshUserTokens()).rejects.toMatchObject({
      statusCode: 401,
      code: 'REFRESH_TOKEN_MISSING',
    });

    expect(redisGet).not.toHaveBeenCalled();
  });

  test('throws when refresh token is not stored in Redis', async () => {
    redisGet.mockResolvedValue(null);

    await expect(refreshUserTokens('invalid-refresh-token')).rejects.toMatchObject({
      statusCode: 401,
      code: 'INVALID_REFRESH_TOKEN',
    });

    expect(redisDel).not.toHaveBeenCalled();
    expect(redisSet).not.toHaveBeenCalled();
  });
});
