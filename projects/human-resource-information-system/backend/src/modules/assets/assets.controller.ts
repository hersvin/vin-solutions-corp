import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Asset, AssetStatus } from '../../entities/asset.entity.js';
import { AssetMaintenance } from '../../entities/asset_maintenance.entity.js';
import { AssetLifecycleService } from './lifecycle.service.js';
import { InventoryService } from './inventory.service.js';

@Controller('assets')
export class AssetsController {
  constructor(
    private readonly lifecycleService: AssetLifecycleService,
    private readonly inventoryService: InventoryService,
    @InjectRepository(Asset)
    private readonly assetRepo: Repository<Asset>,
    @InjectRepository(AssetMaintenance)
    private readonly maintenanceRepo: Repository<AssetMaintenance>,
  ) {}

  @Get('assets')
  async listAssets(@Query('status') status?: string) {
    const where: Record<string, unknown> = { deletedAt: IsNull() };
    if (status) {
      where.status = status as AssetStatus;
    }
    return this.assetRepo.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  @Post('assets')
  async createAsset(
    @Body()
    body: {
      tagNo: string;
      serialNo?: string;
      categoryId: string;
      name: string;
      purchaseDate?: string;
      purchaseCost?: string;
      vendor?: string;
      warrantyUntil?: string;
      conditionCode?: string;
      locationId?: string;
    },
  ) {
    const asset = this.assetRepo.create({
      tagNo: body.tagNo,
      serialNo: body.serialNo ?? null,
      categoryId: body.categoryId,
      name: body.name,
      purchaseDate: body.purchaseDate ?? null,
      purchaseCost: body.purchaseCost ?? null,
      vendor: body.vendor ?? null,
      warrantyUntil: body.warrantyUntil ?? null,
      conditionCode: body.conditionCode ?? null,
      locationId: body.locationId ?? null,
    });
    return this.assetRepo.save(asset);
  }

  @Post('assets/:id/assign')
  assign(@Param('id') id: string, @Body() body: { employeeId: string }) {
    return this.lifecycleService.assign(id, body.employeeId);
  }

  @Post('assets/:id/return')
  returnAsset(
    @Param('id') id: string,
    @Body() body: { assignmentId: string; returnCondition: string },
  ) {
    void id;
    return this.lifecycleService.returnAsset(body.assignmentId, body.returnCondition);
  }

  @Post('assets/:id/transfer')
  transfer(
    @Param('id') id: string,
    @Body() body: { fromLocation: string | null; toLocation: string | null },
    @Req() req: { user?: { id?: string } },
  ) {
    const movedBy = req.user?.id ?? null;
    return this.lifecycleService.transfer(id, body.fromLocation, body.toLocation, movedBy);
  }

  @Post('assets/:id/maintenance')
  setMaintenance(@Param('id') id: string) {
    return this.lifecycleService.setMaintenance(id);
  }

  @Post('assets/maintenance')
  logMaintenance(
    @Body()
    body: {
      assetId: string;
      date: string;
      description?: string;
      cost?: string;
      vendor?: string;
      nextDue?: string;
    },
  ) {
    const record = this.maintenanceRepo.create({
      assetId: body.assetId,
      date: body.date,
      description: body.description ?? null,
      cost: body.cost ?? null,
      vendor: body.vendor ?? null,
      nextDue: body.nextDue ?? null,
    });
    return this.maintenanceRepo.save(record);
  }

  @Get('assets/inventory-check')
  listInventoryChecks(@Query('locationId') locationId?: string) {
    return this.inventoryService.listChecks(locationId);
  }

  @Post('assets/inventory-check')
  createInventoryCheck(
    @Body()
    body: {
      locationId?: string;
      results?: Record<string, unknown>;
      discrepancies?: string[];
    },
  ) {
    return this.inventoryService.createCheck(body);
  }
}
