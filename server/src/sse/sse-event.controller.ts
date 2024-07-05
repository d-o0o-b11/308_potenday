import { Controller, Sse } from '@nestjs/common';
import { EventEmitter2 } from 'eventemitter2';
import { Observable, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';

@Controller('events')
export class EventsController {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  @Sse()
  public liveQuote(): Observable<MessageEvent> {
    return fromEvent(this.eventEmitter, 'statusUpdated').pipe(
      map((data) => {
        return { data: JSON.stringify(data) } as MessageEvent;
      }),
    );
  }
}
