import { beforeEach, describe, expect, jest, test } from '@jest/globals';

const lean = jest.fn();
const sort = jest.fn(() => ({ lean }));

const User = {
  find: jest.fn(() => ({ sort })),
};

jest.unstable_mockModule('../../src/modules/auth/user.model.js', () => ({
  User,
}));

const { getAllUsers } = await import('../../src/modules/admin/admin.service.js');

describe('getAllUsers', () => {
  beforeEach(() => {
    User.find.mockClear();
    sort.mockClear();
    lean.mockReset();
  });

  test('returns all users without password data', async () => {
    const createdAt = new Date('2026-05-02T00:00:00.000Z');
    const updatedAt = new Date('2026-05-03T00:00:00.000Z');

    lean.mockResolvedValue([
      {
        _id: { toString: () => 'user-1' },
        name: 'Ajeya',
        email: 'ajeya@example.com',
        role: 'Admin',
        authProvider: 'local',
        emailVerified: true,
        avatarUrl: '',
        passwordHash: 'hidden-password',
        createdAt,
        updatedAt,
      },
    ]);

    await expect(getAllUsers()).resolves.toEqual([
      {
        id: 'user-1',
        name: 'Ajeya',
        email: 'ajeya@example.com',
        role: 'Admin',
        authProvider: 'local',
        emailVerified: true,
        avatarUrl: '',
        createdAt,
        updatedAt,
      },
    ]);

    expect(User.find).toHaveBeenCalledWith({});
    expect(sort).toHaveBeenCalledWith({ createdAt: -1 });
  });
});
