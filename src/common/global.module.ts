import { Global, Module } from '@nestjs/common';
import { Logger } from './helpers/logger.handler';

@Global()
@Module({
  providers: [Logger],
  exports: [Logger],
})
export class GlobalModule {}
