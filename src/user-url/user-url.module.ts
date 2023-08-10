import { Module } from '@nestjs/common';
import { UserUrlService } from './user-url.service';
import { UserUrlController } from './user-url.controller';
import { EntitiesModule } from 'src/entity.module';
// import { SseService } from './sse.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventsController } from './sse-event.controller';

@Module({
  imports: [EntitiesModule, EventEmitterModule.forRoot()],
  controllers: [UserUrlController, EventsController],
  providers: [UserUrlService],
  exports: [UserUrlService],
})
export class UserUrlModule {}
