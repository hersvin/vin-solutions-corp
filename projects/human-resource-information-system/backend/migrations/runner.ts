import 'reflect-metadata';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import dbConfig from '../src/config/db.config.js';

const entityDir = join(
  fileURLToPath(import.meta.url),
  '../src/entities/**/*.entity{.ts,.js}',
);
const migrationsDir = join(
  fileURLToPath(import.meta.url),
  '../src/migrations/*{.ts,.js}',
);

export async function createApp(): Promise<TestingModule> {
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({ isGlobal: true, load: [dbConfig] }),
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
          extra: { max: 4 },
        }),
        inject: [dbConfig.KEY],
      }),
    ],
  }).compile();
  return module;
}

export async function getDataSource(module: TestingModule): Promise<DataSource> {
  return module.get(getDataSourceToken('default'));
}
