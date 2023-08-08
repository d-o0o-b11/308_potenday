import { Module } from '@nestjs/common';
import { UserUrlService } from './user-url.service';
import { UserUrlController } from './user-url.controller';
import { EntitiesModule } from 'src/entity.module';
import { SseService } from './sse.service';

@Module({
  imports: [EntitiesModule],
  controllers: [UserUrlController],
  providers: [UserUrlService, SseService],
  exports: [UserUrlService],
})
export class UserUrlModule {}
