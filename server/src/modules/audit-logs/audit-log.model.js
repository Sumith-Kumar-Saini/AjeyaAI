import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: [
        'USER_CREATED',
        'USER_UPDATED',
        'USER_DELETED',
        'USER_ENABLED',
        'USER_DISABLED',
        'PROJECT_CREATED',
        'PROJECT_UPDATED',
        'PROJECT_DELETED',
        'ADMIN_LOGIN',
        'ADMIN_ACTION',
      ],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
    },
    targetType: {
      type: String,
      enum: ['User', 'Project', 'Admin'],
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true },
);

// Compound indexes for efficient querying
auditLogSchema.index({ action: 1, timestamp: -1 });
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ targetType: 1, targetId: 1, timestamp: -1 });

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);