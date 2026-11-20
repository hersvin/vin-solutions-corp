import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Notification } from '../../entities/notification.entity.js';
import { NotificationsController } from './notifications.controller.js';
import { DispatchService } from './dispatch.service.js';
import { EventTriggersService } from './event-triggers.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    EventEmitterModule,
  ],
  controllers: [NotificationsController],
  providers: [DispatchService, EventTriggersService],
  exports: [DispatchService, EventTriggersService],
})
export class NotificationsModule {}
