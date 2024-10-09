import { Global, Module } from '@nestjs/common';
import { SlackService } from './utils';

@Global()
@Module({
  providers: [SlackService],
  exports: [SlackService],
})
export class CommonModule {}
