import { Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import type { Request } from 'express';
import { DispatchService } from './dispatch.service.js';

interface AuthedRequest extends Request {
  user?: { id: string };
}

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly dispatchService: DispatchService) {}

  @Get('me')
  getMyNotifications(
    @Req() req: AuthedRequest,
    @Query('unreadOnly') unreadOnly?: string,
  ) {
    const userId = (req.user as { id: string }).id;
    return this.dispatchService.listForUser(userId, unreadOnly === 'true');
  }

  @Post(':id/read')
  markAsRead(@Param('id') id: string, @Req() req: AuthedRequest) {
    const userId = (req.user as { id: string }).id;
    return this.dispatchService.markRead(id, userId);
  }

  @Get('all')
  // Admin only: list all notifications. Guard this route with a role check in production.
  listAll(@Query('unreadOnly') unreadOnly?: string) {
    return this.dispatchService.listForUser('', unreadOnly === 'true');
  }
}
