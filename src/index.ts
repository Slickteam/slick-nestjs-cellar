import { Module } from '@nestjs/common';

import { CellarBucketObjectListContentItem } from './cellar.interface';
import { CellarService } from './cellar.service';

@Module({
  providers: [CellarService],
  exports: [CellarService],
})
class CellarModule {}

export { CellarModule, CellarService, CellarBucketObjectListContentItem };
