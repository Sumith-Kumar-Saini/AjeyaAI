import { getAuditLogs, getAuditLogStats } from './audit-log.service.js';

export const getAuditLogsHandler = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      sortBy = 'timestamp',
      sortOrder = 'desc',
      action,
      userId,
      targetId,
      targetType,
      startDate,
      endDate,
    } = req.query;

    // Validate pagination parameters
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        error: 'Invalid pagination parameters',
      });
    }

    // Validate sort parameters
    const allowedSortFields = ['timestamp', 'action', 'userId'];
    if (!allowedSortFields.includes(sortBy)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid sort field',
      });
    }

    if (!['asc', 'desc'].includes(sortOrder)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid sort order',
      });
    }

    const filters = {
      action,
      userId,
      targetId,
      targetType,
      startDate,
      endDate,
    };

    const options = {
      page: pageNum,
      limit: limitNum,
      sortBy,
      sortOrder,
    };

    const result = await getAuditLogs(filters, options);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const getAuditLogStatsHandler = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const stats = await getAuditLogStats(startDate, endDate);

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching audit log stats:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};