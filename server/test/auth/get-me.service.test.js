import { beforeEach, describe, expect, jest, test } from '@jest/globals';

const User = {
  findById: jest.fn(),
};

jest.unstable_mockModule('../../src/modules/auth/user.model.js', () => ({
  User,
}));

jest.unstable_mockModule('../../src/config/redis.config.js', () => ({
  getRedisClient: jest.fn(),
}));

jest.unstable_mockModule('bcrypt', () => ({
  default: {
    hash: jest.fn(),
    compare: jest.fn(),
  },
}));

jest.unstable_mockModule('jsonwebtoken', () => ({
  default: {
    sign: jest.fn(),
  },
}));

const { getCurrentUser } = await import('../../src/modules/auth/auth.service.js');

describe('getCurrentUser', () => {
  beforeEach(() => {
    User.findById.mockReset();
  });

  test('returns public user data for an existing user', async () => {
    const createdAt = new Date('2026-05-02T00:00:00.000Z');

    User.findById.mockResolvedValue({
      _id: { toString: () => 'user-1' },
      name: 'Ajeya',
      email: 'ajeya@example.com',
      role: 'pm',
      createdAt,
    });

    await expect(getCurrentUser('user-1')).resolves.toEqual({
      id: 'user-1',
      name: 'Ajeya',
      email: 'ajeya@example.com',
      role: 'pm',
      createdAt,
    });

    expect(User.findById).toHaveBeenCalledWith('user-1');
  });

  test('throws when user is not found', async () => {
    User.findById.mockResolvedValue(null);

    await expect(getCurrentUser('missing-user')).rejects.toMatchObject({
      statusCode: 404,
      code: 'USER_NOT_FOUND',
    });
  });
});
