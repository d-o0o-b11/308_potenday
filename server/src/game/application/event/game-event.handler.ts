import { GameNextEvent } from '../../domain';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';

@EventsHandler(GameNextEvent)
export class GameEventHandler implements IEventHandler<GameNextEvent> {
  constructor(private readonly eventEmitter: EventEmitter2) {}
  async handle(event: GameNextEvent) {
    switch (event.constructor) {
      case GameNextEvent:
        this.handlerGameNextEvent(event as GameNextEvent);
        break;

      default:
        break;
    }
  }

  private handlerGameNextEvent(event: GameNextEvent) {
    this.eventEmitter.emit('statusUpdated', {
      urlId: event.urlId,
      status: true,
    });
  }
}
