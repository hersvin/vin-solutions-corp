import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Notification, NotificationChannel } from '../../entities/notification.entity.js';

@Injectable()
export class DispatchService {
  private readonly logger = new Logger(DispatchService.name);

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
  ) {}

  async send(
    userId: string,
    channel: NotificationChannel,
    subject: string,
    body: string | null,
    link?: string | null,
    payload?: Record<string, unknown> | null,
  ): Promise<Notification> {
    const notification = this.notificationRepo.create({
      userId,
      channel,
      subject,
      body,
      link: link ?? null,
      payload: payload ?? null,
    });
    await this.notificationRepo.save(notification);

    if (channel === NotificationChannel.EMAIL) {
      this.logger.log(`dispatching via channel email: ${subject}`);
    } else if (channel === NotificationChannel.SMS) {
      this.logger.log(`dispatching via channel sms: ${subject}`);
    } else {
      this.logger.debug(`in-app notification created: ${subject}`);
    }

    return notification;
  }

  async listForUser(userId: string, unreadOnly?: boolean): Promise<Notification[]> {
    return this.notificationRepo.find({
      where: {
        userId,
        deletedAt: IsNull(),
        ...(unreadOnly ? { readAt: IsNull() } : {}),
      },
      order: { createdAt: 'DESC' },
    });
  }

  async markRead(notificationId: string, userId: string): Promise<Notification> {
    const notification = await this.notificationRepo.findOne({
      where: { id: notificationId, userId, deletedAt: IsNull() },
    });
    if (!notification) {
      throw new NotFoundException(`Notification ${notificationId} not found`);
    }
    notification.readAt = new Date();
    return this.notificationRepo.save(notification);
  }
}
