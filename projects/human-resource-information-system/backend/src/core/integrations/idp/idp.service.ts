import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class IdpService {
  private readonly logger = new Logger(IdpService.name);

  onJoiner(userId: string): { synced: boolean; userId: string } {
    this.logger.log(`IDP onJoiner stub for user ${userId}`);
    return { synced: false, userId };
  }

  onMover(userId: string): { synced: boolean; userId: string } {
    this.logger.log(`IDP onMover stub for user ${userId}`);
    return { synced: false, userId };
  }

  onLeaver(userId: string): { synced: boolean; userId: string } {
    this.logger.log(`IDP onLeaver stub for user ${userId}`);
    return { synced: false, userId };
  }
}
