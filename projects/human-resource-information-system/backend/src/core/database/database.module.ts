import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import dbConfig from '../../config/db.config.js';

const entityDir = join(
  fileURLToPath(import.meta.url),
  '../../../entities/**/*.entity{.ts,.js}',
);
const migrationsDir = join(
  fileURLToPath(import.meta.url),
  '../../../migrations/*{.ts,.js}',
);

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigType<typeof dbConfig>) => ({
        type: 'postgres' as const,
        host: config.host,
        port: config.port,
        username: config.username,
        password: config.password,
        database: config.database,
        entities: [entityDir],
        migrations: [migrationsDir],
        migrationsRun: false,
        synchronize: false,
        logging: process.env.NODE_ENV !== 'production',
        extra: { max: 10 },
      }),
      inject: [dbConfig.KEY],
    }),
  ],
})
export class DatabaseModule {}
