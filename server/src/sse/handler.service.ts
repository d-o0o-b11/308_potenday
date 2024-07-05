import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class StockCreatedListener {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  @OnEvent('statusUpdated')
  handleStockCreatedEvent(event) {
    this.eventEmitter.emit('statusUpdated', event);
  }
}
