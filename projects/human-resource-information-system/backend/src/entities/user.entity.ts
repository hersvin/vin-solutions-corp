import { Column, Entity, Index } from 'typeorm';
import { SoftDeletableEntity } from './soft-deletable.entity.js';

@Entity('user')
export class User extends SoftDeletableEntity {
  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ name: 'full_name', type: 'varchar' })
  fullName: string;

  @Column({ name: 'password_hash', type: 'varchar', nullable: true })
  passwordHash: string | null;

  @Column({ name: 'mfa_secret_ref', type: 'varchar', nullable: true })
  mfaSecretRef: string | null;

  @Column({ name: 'external_idp_ref', type: 'varchar', nullable: true })
  externalIdpRef: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'last_login_at', type: 'timestamptz', nullable: true })
  lastLoginAt: Date | null;

  @Column({
    name: 'refresh_token_hash',
    type: 'varchar',
    nullable: true,
  })
  refreshTokenHash: string | null;
}
