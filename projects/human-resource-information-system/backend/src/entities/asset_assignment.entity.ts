import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity.js';
import { Asset } from './asset.entity.js';
import { Employee } from './employee.entity.js';

@Entity('asset_assignment')
export class AssetAssignment extends BaseEntity {
  @Column({ name: 'asset_id', type: 'uuid' })
  assetId: string;

  @ManyToOne(() => Asset, { eager: true })
  @JoinColumn({ name: 'asset_id' })
  asset: Asset;

  @Column({ name: 'employee_id', type: 'uuid' })
  employeeId: string;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ name: 'assigned_at', type: 'timestamptz' })
  assignedAt: Date;

  @Column({ name: 'acknowledged_at', type: 'timestamptz', nullable: true })
  acknowledgedAt: Date | null;

  @Column({ name: 'acknowledged_by', type: 'uuid', nullable: true })
  acknowledgedBy: string | null;

  @Column({ name: 'returned_at', type: 'timestamptz', nullable: true })
  returnedAt: Date | null;

  @Column({ name: 'return_condition', type: 'varchar', nullable: true })
  returnCondition: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;
}
