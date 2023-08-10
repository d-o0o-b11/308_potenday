import { Module } from '@nestjs/common';
import { EventsController } from './sse-event.controller';
import { StockCreatedListener } from './handler.service';

@Module({
  controllers: [EventsController],
  providers: [StockCreatedListener],
})
export class SseModule {}
