import { AuditLog } from './audit-log.model.js';

const toPublicAuditLog = (log) => ({
  id: log._id.toString(),
  action: log.action,
  userId: log.userId.toString(),
  targetId: log.targetId?.toString(),
  targetType: log.targetType,
  details: log.details,
  ipAddress: log.ipAddress,
  userAgent: log.userAgent,
  timestamp: log.timestamp,
});

export const createAuditLog = async (logData) => {
  const log = await AuditLog.create(logData);
  return toPublicAuditLog(log);
};

export const getAuditLogs = async (filters = {}, options = {}) => {
  const {
    page = 1,
    limit = 50,
    sortBy = 'timestamp',
    sortOrder = 'desc',
  } = options;

  const {
    action,
    userId,
    targetId,
    targetType,
    startDate,
    endDate,
  } = filters;

  const query = {};

  if (action) {
    query.action = action;
  }

  if (userId) {
    query.userId = userId;
  }

  if (targetId) {
    query.targetId = targetId;
  }

  if (targetType) {
    query.targetType = targetType;
  }

  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) {
      query.timestamp.$gte = new Date(startDate);
    }
    if (endDate) {
      query.timestamp.$lte = new Date(endDate);
    }
  }

  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    AuditLog.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name email')
      .lean(),
    AuditLog.countDocuments(query),
  ]);

  return {
    logs: logs.map(toPublicAuditLog),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getAuditLogStats = async (startDate, endDate) => {
  const dateFilter = {};
  if (startDate) dateFilter.$gte = new Date(startDate);
  if (endDate) dateFilter.$lte = new Date(endDate);

  const query = dateFilter.timestamp ? { timestamp: dateFilter } : {};

  const stats = await AuditLog.aggregate([
    { $match: query },
    {
      $group: {
        _id: {
          action: '$action',
          date: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$timestamp',
            },
          },
        },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: '$_id.action',
        dailyStats: {
          $push: {
            date: '$_id.date',
            count: '$count',
          },
        },
        totalCount: { $sum: '$count' },
      },
    },
    {
      $project: {
        action: '$_id',
        totalCount: 1,
        dailyStats: 1,
        _id: 0,
      },
    },
  ]);

  return stats;
};