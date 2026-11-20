import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { SoftDeletableEntity } from './soft-deletable.entity.js';
import { User } from './user.entity.js';

export enum NotificationChannel {
  IN_APP = 'in-app',
  EMAIL = 'email',
  SMS = 'sms',
}

@Entity('notification')
export class Notification extends SoftDeletableEntity {
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', default: NotificationChannel.IN_APP })
  channel: NotificationChannel;

  @Column({ type: 'varchar' })
  subject: string;

  @Column({ type: 'text', nullable: true })
  body: string | null;

  @Column({ type: 'varchar', nullable: true })
  link: string | null;

  @Column({ name: 'read_at', type: 'timestamptz', nullable: true })
  readAt: Date | null;

  @Column({ type: 'jsonb', nullable: true })
  payload: Record<string, unknown> | null;
}
