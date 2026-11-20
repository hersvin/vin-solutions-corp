import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DOMAIN_EVENTS } from '../../core/events/domain-events.js';
import type { DomainEventPayload } from '../../core/events/domain-events.js';
import { DispatchService } from './dispatch.service.js';
import { NotificationChannel } from '../../entities/notification.entity.js';

@Injectable()
export class EventTriggersService {
  private readonly logger = new Logger(EventTriggersService.name);

  constructor(private readonly dispatchService: DispatchService) {}

  @OnEvent(DOMAIN_EVENTS.LEAVE_APPROVED)
  async onLeaveApproved(payload: DomainEventPayload): Promise<void> {
    this.logger.log(`Processing leave.approved event: ${payload.entityId}`);
    if (payload.actorUserId) {
      await this.dispatchService.send(
        payload.actorUserId,
        NotificationChannel.IN_APP,
        'Leave Request Approved',
        `Your leave request has been approved.`,
        undefined,
        { entityId: payload.entityId, correlationId: payload.correlationId },
      );
    }
  }

  @OnEvent(DOMAIN_EVENTS.ATTENDANCE_CORRECTED)
  async onAttendanceCorrected(payload: DomainEventPayload): Promise<void> {
    this.logger.log(`Processing attendance.corrected event: ${payload.entityId}`);
    if (payload.actorUserId) {
      await this.dispatchService.send(
        payload.actorUserId,
        NotificationChannel.IN_APP,
        'Attendance Corrected',
        `Your attendance record has been corrected.`,
        undefined,
        { entityId: payload.entityId, correlationId: payload.correlationId },
      );
    }
  }

  @OnEvent(DOMAIN_EVENTS.ASSET_ASSIGNED)
  async onAssetAssigned(payload: DomainEventPayload): Promise<void> {
    this.logger.log(`Processing asset.assigned event: ${payload.entityId}`);
    if (payload.actorUserId) {
      await this.dispatchService.send(
        payload.actorUserId,
        NotificationChannel.IN_APP,
        'Asset Assigned',
        `A company asset has been assigned to you.`,
        undefined,
        { entityId: payload.entityId, correlationId: payload.correlationId },
      );
    }
  }

  @OnEvent(DOMAIN_EVENTS.ASSET_RETURNED)
  async onAssetReturned(payload: DomainEventPayload): Promise<void> {
    this.logger.log(`Processing asset.returned event: ${payload.entityId}`);
    if (payload.actorUserId) {
      await this.dispatchService.send(
        payload.actorUserId,
        NotificationChannel.IN_APP,
        'Asset Returned',
        `A company asset has been returned.`,
        undefined,
        { entityId: payload.entityId, correlationId: payload.correlationId },
      );
    }
  }

  @OnEvent(DOMAIN_EVENTS.TASK_COMPLETED)
  async onTaskCompleted(payload: DomainEventPayload): Promise<void> {
    this.logger.log(`Processing task.completed event: ${payload.entityId}`);
    if (payload.actorUserId) {
      await this.dispatchService.send(
        payload.actorUserId,
        NotificationChannel.IN_APP,
        'Task Completed',
        `A task you were assigned has been completed.`,
        undefined,
        { entityId: payload.entityId, correlationId: payload.correlationId },
      );
    }
  }
}
