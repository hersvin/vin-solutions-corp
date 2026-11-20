import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssetInventoryCheck } from '../../entities/asset_inventory_check.entity.js';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(AssetInventoryCheck)
    private readonly checkRepo: Repository<AssetInventoryCheck>,
  ) {}

  async createCheck(body: {
    locationId?: string;
    results?: Record<string, unknown>;
    discrepancies?: string[];
  }): Promise<AssetInventoryCheck> {
    const check = this.checkRepo.create({
      locationId: body.locationId ?? null,
      checkedAt: new Date(),
      results: body.results ?? null,
      discrepancies: body.discrepancies ?? [],
    });
    return this.checkRepo.save(check);
  }

  async listChecks(locationId?: string): Promise<AssetInventoryCheck[]> {
    return this.checkRepo.find({
      where: { ...(locationId ? { locationId } : {}) },
      order: { checkedAt: 'DESC' },
    });
  }
}
