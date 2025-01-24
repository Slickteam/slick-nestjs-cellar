import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  HeadObjectCommandOutput,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
  ServiceOutputTypes,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CellarBucketObjectListContentItem } from './cellar.interface';

const logger = new Logger('CellarService');

@Injectable()
export class CellarService {
  public readonly timeoutSignedUrl: number;
  public readonly s3EndPoint: string;
  public readonly s3Client: S3Client;

  public constructor(private configService: ConfigService) {
    this.s3EndPoint = `https://${this.configService.getOrThrow('CELLAR_ADDON_HOST')}`;
    const regionBucket = this.configService.get('CELLAR_REGION') ?? 'fr';
    this.timeoutSignedUrl = this.configService.get<number>('CELLAR_TIMEOUT_SIGNED_URL') ?? 3600;
    this.s3Client = new S3Client({
      endpoint: this.s3EndPoint,
      region: regionBucket,
      credentials: {
        accessKeyId: this.configService.getOrThrow('CELLAR_ADDON_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow('CELLAR_ADDON_KEY_SECRET'),
      },
    });
  }

  public async listObjectsByBucketName(name: string): Promise<CellarBucketObjectListContentItem[]> {
    const result = await this.s3Client.send(
      new ListObjectsV2Command({
        Bucket: name,
      }),
    );
    return (
      result.Contents?.map((c) => ({
        name: c.Key ?? '',
        lastModified: c.LastModified ?? '',
        eTag: c.ETag ?? '',
        size: c.Size ?? 0,
        storageClass: c.StorageClass ?? '',
      })) ?? []
    );
  }

  public async createPresignedUrlWithClient(bucketName: string, keyObject: string): Promise<string> {
    const command = new GetObjectCommand({ Bucket: bucketName, Key: keyObject });
    return getSignedUrl(this.s3Client, command, { expiresIn: this.timeoutSignedUrl });
  }

  public async uploadFile(
    bucketName: string,
    file: { buffer: Buffer; mimetype: string; originalname: string },
  ): Promise<ServiceOutputTypes> {
    return this.s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: file.originalname,
        Body: file.buffer,
        ACL: 'bucket-owner-full-control',
        ContentType: file.mimetype,
      }),
    );
  }

  public async deleteFile(bucketName: string, fileName: string): Promise<ServiceOutputTypes> {
    return this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: fileName,
      }),
    );
  }

  private async getObjectMetadata(bucketName: string, fileName: string): Promise<HeadObjectCommandOutput> {
    return this.s3Client.send(new HeadObjectCommand({ Bucket: bucketName, Key: fileName }));
  }

  public async isFileExist(bucketName: string, fileName: string): Promise<boolean | never> {
    const result = await this.getObjectMetadata(bucketName, fileName);
    const code = result?.$metadata?.httpStatusCode ?? 500;
    return code >= 200 && code < 400;
  }

  public async getSignedUrl(bucketName: string, fileName: string): Promise<string> {
    const command = new GetObjectCommand({ Bucket: bucketName, Key: fileName });
    return getSignedUrl(this.s3Client, command, { expiresIn: this.timeoutSignedUrl });
  }

  public async uploadPdfToS3(bucketName: string, fileName: string, pdfBuffer: Buffer): Promise<void | never> {
    await this.uploadFile(bucketName, {
      buffer: pdfBuffer,
      originalname: fileName,
      mimetype: 'application/pdf',
    });
  }

  public async downloadPdfFromS3(bucketName: string, fileName: string): Promise<Buffer | never> {
    const resultCommand = await this.s3Client.send(new GetObjectCommand({ Bucket: bucketName, Key: fileName }));
    const rawFileBytes = await resultCommand.Body?.transformToByteArray();
    if (rawFileBytes) {
      return Buffer.from(rawFileBytes);
    } else {
      throw new Error(`Error when downloading PDF from S3 with fileName[${fileName}]`);
    }
  }
}
