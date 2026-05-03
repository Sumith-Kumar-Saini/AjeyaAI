import { User } from '../auth/user.model.js';
import { Project } from '../projects/project.model.js';

const toAdminUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role || 'User',
  authProvider: user.authProvider,
  emailVerified: user.emailVerified,
  avatarUrl: user.avatarUrl,
  isEnabled: user.isEnabled,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const getAllUsers = async () => {
  const users = await User.find({role: { $ne: "Admin" }})
    .sort({ createdAt: -1 })
    .lean();

  return users.map(toAdminUser);
};

export const updateUserStatus = async (userId, isEnabled) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { isEnabled },
    { new: true }
  ).lean();

  if (!user) {
    throw new Error('User not found');
  }

  return toAdminUser(user);
};

export const getPlatformStats = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // User stats
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ isEnabled: true });
  const disabledUsers = await User.countDocuments({ isEnabled: false });
  const adminUsers = await User.countDocuments({ role: 'Admin' });
  const recentUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

  // Project stats
  const totalProjects = await Project.countDocuments();
  const recentProjects = await Project.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

  return {
    users: {
      total: totalUsers,
      active: activeUsers,
      disabled: disabledUsers,
      admin: adminUsers,
      recent: recentUsers,
    },
    projects: {
      total: totalProjects,
      recent: recentProjects,
    },
    generatedAt: new Date(),
  };
};
