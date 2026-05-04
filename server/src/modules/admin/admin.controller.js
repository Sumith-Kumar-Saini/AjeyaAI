import { getAllUsers, updateUserStatus, getPlatformStats } from './admin.service.js';
import { logAudit } from '../audit-logs/auditLogger.js';

export const listUsers = async (req, res) => {
  try {
    const users = await getAllUsers();

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const updateUserStatusHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { isEnabled } = req.body;

    if (typeof isEnabled !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'isEnabled must be a boolean value',
      });
    }

    const user = await updateUserStatus(id, isEnabled, req.user._id);

    logAudit({
      action: isEnabled ? 'USER_ENABLED' : 'USER_DISABLED',
      userId: req.user._id,
      targetId: id,
      targetType: 'User',
      details: {
        previousStatus: !isEnabled,
        newStatus: isEnabled,
        targetUserEmail: user.email,
      },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return res.status(200).json({
      success: true,
      message: `User has been ${isEnabled ? 'enabled' : 'disabled'} successfully`,
      data: user,
    });
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const getStats = async (req, res) => {
  try {
    const stats = await getPlatformStats();

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};
