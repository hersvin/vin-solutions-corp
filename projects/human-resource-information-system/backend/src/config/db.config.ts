import { registerAs } from '@nestjs/config';

export default registerAs('db', () => ({
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER ?? 'hersvin',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME ?? 'hersvin',
}));
