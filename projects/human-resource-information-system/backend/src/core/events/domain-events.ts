export const DOMAIN_EVENTS = {
  EMPLOYEE_HIRED: 'employee.hired',
  EMPLOYEE_TERMINATED: 'employee.terminated',
  PAYROLL_LOCKED: 'payroll.locked',
  PAYROLL_EXPORTED: 'payroll.exported',
  LEAVE_APPROVED: 'leave.approved',
  LEAVE_CANCELLED: 'leave.cancelled',
  ATTENDANCE_CORRECTED: 'attendance.corrected',
  ASSET_ASSIGNED: 'asset.assigned',
  ASSET_RETURNED: 'asset.returned',
  TASK_COMPLETED: 'task.completed',
  DOCUMENT_EXPIRED: 'document.expired',
} as const;

export type DomainEvent = (typeof DOMAIN_EVENTS)[keyof typeof DOMAIN_EVENTS];

export interface DomainEventPayload {
  correlationId: string;
  actorUserId?: string;
  entityId: string;
  timestamp: Date;
}
