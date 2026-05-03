import { beforeEach, describe, expect, jest, test } from '@jest/globals';

const Project = {
  findOneAndUpdate: jest.fn(),
};

jest.unstable_mockModule('../../src/modules/projects/project.model.js', () => ({
  Project,
}));

const { updateProjectForUser } = await import('../../src/modules/projects/projects.service.js');

describe('updateProjectForUser', () => {
  beforeEach(() => {
    Project.findOneAndUpdate.mockReset();
  });

  test('updates a project owned by the user', async () => {
    const projectId = '6634ef68e77af9d33200a111';
    const updatedAt = new Date('2026-05-02T00:00:00.000Z');

    Project.findOneAndUpdate.mockReturnValue({
      lean: jest.fn().mockResolvedValue({
        _id: { toString: () => projectId },
        name: 'Updated project',
        description: 'Updated description',
        owner: { toString: () => 'user-1' },
        createdAt: new Date('2026-05-01T00:00:00.000Z'),
        updatedAt,
      }),
    });

    const result = await updateProjectForUser('user-1', projectId, {
      name: 'Updated project',
      description: 'Updated description',
    });

    expect(Project.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: projectId, owner: 'user-1' },
      { $set: { name: 'Updated project', description: 'Updated description' } },
      { new: true, runValidators: true },
    );
    expect(result).toMatchObject({
      id: projectId,
      name: 'Updated project',
      description: 'Updated description',
      owner: 'user-1',
      updatedAt,
    });
  });

  test('returns null when the project id is invalid', async () => {
    const result = await updateProjectForUser('user-1', 'bad-id', {
      name: 'Updated project',
    });

    expect(result).toBeNull();
    expect(Project.findOneAndUpdate).not.toHaveBeenCalled();
  });

  test('returns null when no owned project matches', async () => {
    const projectId = '6634ef68e77af9d33200a111';

    Project.findOneAndUpdate.mockReturnValue({
      lean: jest.fn().mockResolvedValue(null),
    });

    const result = await updateProjectForUser('user-1', projectId, {
      description: 'Updated description',
    });

    expect(result).toBeNull();
  });
});
