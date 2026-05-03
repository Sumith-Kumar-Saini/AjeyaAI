import { beforeEach, describe, expect, jest, test } from '@jest/globals';

const lean = jest.fn();
const select = jest.fn(() => ({ lean }));

const User = {
  findById: jest.fn(() => ({ select })),
};

jest.unstable_mockModule('../../src/modules/auth/user.model.js', () => ({
  User,
}));

const { requireAdmin } = await import('../../src/modules/admin/admin.middleware.js');

describe('requireAdmin', () => {
  beforeEach(() => {
    User.findById.mockClear();
    select.mockClear();
    lean.mockReset();
  });

  test('continues when current user is an admin', async () => {
    const req = { user: { id: 'admin-1' } };
    const next = jest.fn();

    lean.mockResolvedValue({ _id: 'admin-1', role: 'Admin' });

    await requireAdmin(req, {}, next);

    expect(User.findById).toHaveBeenCalledWith('admin-1');
    expect(select).toHaveBeenCalledWith('role');
    expect(next).toHaveBeenCalledWith();
  });

  test('rejects when current user is not an admin', async () => {
    const req = { user: { id: 'user-1' } };
    const next = jest.fn();

    lean.mockResolvedValue({ _id: 'user-1', role: 'User' });

    await requireAdmin(req, {}, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Admin access required',
      statusCode: 403,
      code: 'ADMIN_ACCESS_REQUIRED',
    }));
  });

  test('rejects when current user is missing from database', async () => {
    const req = { user: { id: 'missing-user' } };
    const next = jest.fn();

    lean.mockResolvedValue(null);

    await requireAdmin(req, {}, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      message: 'User not found',
      statusCode: 401,
      code: 'USER_NOT_FOUND',
    }));
  });
});
