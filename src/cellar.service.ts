import {
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
  GetObjectCommand,
  GetObjectCommandOutput,
  HeadObjectCommand,
  ListObjectsV2Command,
  ObjectCannedACL,
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CellarBucketObjectListContentItem, CellarUploadFile } from './cellar.interface';

@Injectable()
export class CellarService {
  public readonly timeoutSignedUrl: number;
  public readonly s3EndPoint: string;
  public readonly s3Client: S3Client;

  public constructor(private configService: ConfigService) {
    this.s3EndPoint = `https://${this.configService.getOrThrow('CELLAR_HOST')}`;
    this.timeoutSignedUrl = this.configService.get<number>('CELLAR_TIMEOUT_SIGNED_URL') ?? 3600;
    this.s3Client = new S3Client({
      endpoint: this.s3EndPoint,
      region: this.configService.get('CELLAR_REGION') ?? 'fr',
      credentials: {
        accessKeyId: this.configService.getOrThrow('CELLAR_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow('CELLAR_KEY_SECRET'),
      },
    });
  }

  public async listObjectsByBucketName(bucketName: string): Promise<CellarBucketObjectListContentItem[]> {
    const result = await this.s3Client.send(new ListObjectsV2Command({ Bucket: bucketName }));
    return (
      result.Contents?.map((object) => ({
        name: object.Key ?? '',
        lastModified: object.LastModified,
        eTag: object.ETag ?? '',
        size: object.Size ?? 0,
        storageClass: object.StorageClass ?? '',
      })) ?? []
    );
  }

  public async uploadFile(
    bucketName: string,
    file: CellarUploadFile,
    acl: ObjectCannedACL = 'bucket-owner-full-control',
  ): Promise<PutObjectCommandOutput> {
    return this.s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: file.originalname,
        Body: file.buffer,
        ACL: acl,
        ContentType: file.mimetype,
      }),
    );
  }

  public async getFile(bucketName: string, fileName: string): Promise<GetObjectCommandOutput> {
    return this.s3Client.send(new GetObjectCommand({ Bucket: bucketName, Key: fileName }));
  }

  public async deleteFile(bucketName: string, fileName: string): Promise<DeleteObjectCommandOutput> {
    return this.s3Client.send(new DeleteObjectCommand({ Bucket: bucketName, Key: fileName }));
  }

  public async fileExists(bucketName: string, fileName: string): Promise<boolean> {
    const result = await this.s3Client.send(new HeadObjectCommand({ Bucket: bucketName, Key: fileName }));
    const statusCode = result.$metadata.httpStatusCode ?? 500;
    return statusCode >= 200 && statusCode < 400;
  }

  public async getSignedUrl(bucketName: string, fileName: string): Promise<string> {
    const command = new GetObjectCommand({ Bucket: bucketName, Key: fileName });
    return getSignedUrl(this.s3Client, command, { expiresIn: this.timeoutSignedUrl });
  }
}
