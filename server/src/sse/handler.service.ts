import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class StockCreatedListener {
  @OnEvent('statusUpdated')
  handleStockCreatedEvent(event) {
    console.log('이벤트', event);
  }
}
