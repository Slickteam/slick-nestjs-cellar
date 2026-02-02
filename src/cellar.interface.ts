export interface CellarBucketObjectListContentItem {
  name: string;
  lastModified: Date | undefined;
  eTag: string;
  size: number;
  storageClass: string;
}

export interface CellarUploadFile {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
}
