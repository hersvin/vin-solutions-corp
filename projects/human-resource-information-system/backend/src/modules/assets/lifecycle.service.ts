import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Asset, AssetStatus } from '../../entities/asset.entity.js';
import { AssetAssignment } from '../../entities/asset_assignment.entity.js';
import { AssetTransfer } from '../../entities/asset_transfer.entity.js';
import { DOMAIN_EVENTS } from '../../core/events/domain-events.js';

@Injectable()
export class AssetLifecycleService {
  private readonly logger = new Logger(AssetLifecycleService.name);

  constructor(
    @InjectRepository(Asset)
    private readonly assetRepo: Repository<Asset>,
    @InjectRepository(AssetAssignment)
    private readonly assignmentRepo: Repository<AssetAssignment>,
    @InjectRepository(AssetTransfer)
    private readonly transferRepo: Repository<AssetTransfer>,
    private readonly events: EventEmitter2,
  ) {}

  async assign(assetId: string, employeeId: string): Promise<AssetAssignment> {
    const asset = await this.findAssetOrThrow(assetId);
    const assignment = this.assignmentRepo.create({
      assetId,
      employeeId,
      assignedAt: new Date(),
      acknowledgedAt: null,
      acknowledgedBy: null,
      returnedAt: null,
      returnCondition: null,
      notes: null,
    });
    const saved = await this.assignmentRepo.save(assignment);
    asset.status = AssetStatus.ASSIGNED;
    await this.assetRepo.save(asset);
    this.events.emit(DOMAIN_EVENTS.ASSET_ASSIGNED, {
      correlationId: saved.id,
      entityId: assetId,
      timestamp: new Date(),
    });
    return saved;
  }

  async returnAsset(
    assignmentId: string,
    returnCondition: string,
  ): Promise<AssetAssignment> {
    const assignment = await this.findAssignmentOrThrow(assignmentId);
    const asset = await this.assetRepo.findOne({
      where: { id: assignment.assetId, deletedAt: IsNull() },
    });
    assignment.returnedAt = new Date();
    assignment.returnCondition = returnCondition;
    const saved = await this.assignmentRepo.save(assignment);
    if (asset) {
      asset.status = AssetStatus.AVAILABLE;
      await this.assetRepo.save(asset);
    }
    this.events.emit(DOMAIN_EVENTS.ASSET_RETURNED, {
      correlationId: saved.id,
      entityId: assignment.assetId,
      timestamp: new Date(),
    });
    this.logger.debug(`Asset assignment ${assignmentId} returned`);
    return saved;
  }

  async transfer(
    assetId: string,
    fromLocation: string | null,
    toLocation: string | null,
    movedBy: string | null,
  ): Promise<AssetTransfer> {
    const asset = await this.findAssetOrThrow(assetId);
    asset.locationId = toLocation;
    await this.assetRepo.save(asset);
    const transferRecord = this.transferRepo.create({
      assetId,
      fromLocation,
      toLocation,
      movedAt: new Date(),
      movedBy,
    });
    return this.transferRepo.save(transferRecord);
  }

  async setMaintenance(assetId: string): Promise<Asset> {
    const asset = await this.findAssetOrThrow(assetId);
    asset.status = AssetStatus.MAINTENANCE;
    return this.assetRepo.save(asset);
  }

  private async findAssetOrThrow(id: string): Promise<Asset> {
    const asset = await this.assetRepo.findOne({ where: { id, deletedAt: IsNull() } });
    if (!asset) throw new NotFoundException(`Asset ${id} not found`);
    return asset;
  }

  private async findAssignmentOrThrow(
    id: string,
  ): Promise<AssetAssignment> {
    const assignment = await this.assignmentRepo.findOne({ where: { id } });
    if (!assignment) throw new NotFoundException(`Assignment ${id} not found`);
    return assignment;
  }
}
