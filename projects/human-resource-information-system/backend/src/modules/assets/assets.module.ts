import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Asset } from '../../entities/asset.entity.js';
import { AssetCategory } from '../../entities/asset_category.entity.js';
import { AssetAssignment } from '../../entities/asset_assignment.entity.js';
import { AssetTransfer } from '../../entities/asset_transfer.entity.js';
import { AssetMaintenance } from '../../entities/asset_maintenance.entity.js';
import { AssetInventoryCheck } from '../../entities/asset_inventory_check.entity.js';
import { AssetsController } from './assets.controller.js';
import { AssetLifecycleService } from './lifecycle.service.js';
import { InventoryService } from './inventory.service.js';
import { ImsSyncService } from './ims-sync.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Asset,
      AssetCategory,
      AssetAssignment,
      AssetTransfer,
      AssetMaintenance,
      AssetInventoryCheck,
    ]),
    EventEmitterModule,
  ],
  controllers: [AssetsController],
  providers: [AssetLifecycleService, InventoryService, ImsSyncService],
  exports: [AssetLifecycleService, InventoryService, ImsSyncService],
})
export class AssetsModule {}
