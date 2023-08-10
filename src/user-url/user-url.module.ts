import { Module } from '@nestjs/common';
import { UserUrlService } from './user-url.service';
import { UserUrlController } from './user-url.controller';
import { EntitiesModule } from 'src/entity.module';
// import { SseService } from './sse.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventsController } from './sse-event.controller';
import { StockCreatedListener } from './handler.service';

@Module({
  imports: [
    EntitiesModule,
    EventEmitterModule.forRoot({
      // set this to `true` to use wildcards
      wildcard: false,
      // the delimiter used to segment namespaces
      delimiter: '.',
      // set this to `true` if you want to emit the newListener event
      newListener: false,
      // set this to `true` if you want to emit the removeListener event
      removeListener: false,
      // the maximum amount of listeners that can be assigned to an event
      maxListeners: 10,
      // show event name in memory leak message when more than maximum amount of listeners is assigned
      verboseMemoryLeak: false,
      // disable throwing uncaughtException if an error event is emitted and it has no listeners
      ignoreErrors: false,
    }),
  ],
  controllers: [UserUrlController, EventsController],
  providers: [UserUrlService, StockCreatedListener],
  exports: [UserUrlService],
})
export class UserUrlModule {}
