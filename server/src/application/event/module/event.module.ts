import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EventExceptionHandlerService } from '../handler';

@Module({
  imports: [CqrsModule],
  providers: [EventExceptionHandlerService],
})
export class EventModule {}
