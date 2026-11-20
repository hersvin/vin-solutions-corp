import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import storageConfig from '../../config/storage.config.js';
import { StorageService } from './storage.service.js';

@Module({
  imports: [
    // Register the storage factory at this module level so ConfigService.get
    // resolves the factory even when StorageService is pulled in by another
    // module that does not itself load the factory.
    ConfigModule.forFeature(storageConfig),
  ],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
