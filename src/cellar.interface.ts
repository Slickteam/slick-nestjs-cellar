export interface CellarBucketObjectListContentItem {
  name: string;
  lastModified: string | Date;
  eTag: string;
  size: number;
  storageClass: string;
}
