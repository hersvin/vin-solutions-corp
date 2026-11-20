import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => ({
  minioEndpoint: process.env.MINIO_ENDPOINT ?? 'localhost:9000',
  minioBucket: process.env.MINIO_BUCKET ?? 'hersvin-docs',
  minioAccessKey: process.env.MINIO_ACCESS_KEY,
  minioSecretKey: process.env.MINIO_SECRET_KEY,
  minioSignedUrlTtl: Number(process.env.MINIO_SIGNED_URL_TTL ?? 3600),
}));
