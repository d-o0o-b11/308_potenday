import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EventExceptionHandlerService } from '../handler';
import { EVENT_REPOSITORY_TOKEN, EventRepository } from '@infrastructure';

@Module({
  imports: [CqrsModule],
  providers: [
    EventExceptionHandlerService,
    {
      provide: EVENT_REPOSITORY_TOKEN,
      useClass: EventRepository,
    },
  ],
  exports: [EVENT_REPOSITORY_TOKEN],
})
export class EventModule {}
