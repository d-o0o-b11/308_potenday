import { Module } from '@nestjs/common';
import { UserUrlService } from './user-url.service';
import { UserUrlController } from './user-url.controller';

@Module({
  controllers: [UserUrlController],
  providers: [UserUrlService],
})
export class UserUrlModule {}
