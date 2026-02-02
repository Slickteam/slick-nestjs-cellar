import { Module } from '@nestjs/common';

import { CellarBucketObjectListContentItem, CellarUploadFile } from './cellar.interface';
import { CellarService } from './cellar.service';

@Module({
  providers: [CellarService],
  exports: [CellarService],
})
class CellarModule {}

export { CellarModule, CellarService, CellarBucketObjectListContentItem, CellarUploadFile };
