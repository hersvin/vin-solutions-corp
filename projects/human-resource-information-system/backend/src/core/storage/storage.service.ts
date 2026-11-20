import { Injectable, Logger } from '@nestjs/common';
import { Client } from 'minio';

const DEFAULT_MINIO_ENDPOINT = 'localhost';
const DEFAULT_MINIO_PORT = 9000;
const DEFAULT_MINIO_BUCKET = 'hersvin-docs';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly client: Client;
  private readonly bucket: string;
  private readonly signedUrlTtl: number;
  private readonly accessKey: string;
  private readonly secretKey: string;

  constructor() {
    this.bucket = process.env.MINIO_BUCKET ?? DEFAULT_MINIO_BUCKET;
    this.signedUrlTtl = Number(process.env.MINIO_SIGNED_URL_TTL ?? 3600);
    this.accessKey = process.env.MINIO_ACCESS_KEY ?? '';
    this.secretKey = process.env.MINIO_SECRET_KEY ?? '';
    this.client = this.createClient();
  }

  private createClient(): Client {
    // MinIO's isValidEndpoint rejects URLs with scheme or port.
    // Read host and port separately, pass a bare hostname to the client.
    const raw = (process.env.MINIO_ENDPOINT ?? `${DEFAULT_MINIO_ENDPOINT}:${DEFAULT_MINIO_PORT}`).replace(/^https?:\/\//, '').replace(/\/+$/, '');
    const [host, port] = raw.split(':');
    return new Client({
      endPoint: host ?? DEFAULT_MINIO_ENDPOINT,
      port: Number(port ?? DEFAULT_MINIO_PORT),
      accessKey: this.accessKey,
      secretKey: this.secretKey,
      useSSL: false,
    });
  }

  async ensureBucket(): Promise<void> {
    try {
      const exists = await this.client.bucketExists(this.bucket);
      if (!exists) {
        await this.client.makeBucket(this.bucket);
        this.logger.debug(`bucket created: ${this.bucket}`);
      }
    } catch (error) {
      this.logger.warn(
        `could not ensure bucket ${this.bucket}`,
        error instanceof Error ? error : String(error),
      );
    }
  }

  async upload(
    key: string,
    file: Buffer,
    contentType: string,
  ): Promise<string> {
    await this.client.putObject(this.bucket, key, file, file.length, {
      'Content-Type': contentType,
    });
    return key;
  }

  async getSignedDownloadUrl(key: string, ttlSeconds?: number): Promise<string> {
    const ttl = (ttlSeconds ?? this.signedUrlTtl) * 1000;
    const url = await this.client.presignedGetObject(this.bucket, key, ttl);
    return url;
  }

  async delete(key: string): Promise<void> {
    await this.client.removeObject(this.bucket, key);
  }
}
