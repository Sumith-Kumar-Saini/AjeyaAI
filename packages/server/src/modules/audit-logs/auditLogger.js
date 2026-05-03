import { createAuditLog } from './audit-log.service.js';

export const logAudit = (logData) => {
  setImmediate(async () => {
    try {
      await createAuditLog(logData);
    } catch (error) {
      console.error('Audit log error:', error);
    }
  });
};
