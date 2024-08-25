import { GameNextEvent, IEventRepository } from '@domain';
import { EVENT_REPOSITORY_TOKEN } from '@infrastructure';
import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@EventsHandler(GameNextEvent)
export class GameEventHandler implements IEventHandler<GameNextEvent> {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    @Inject(EVENT_REPOSITORY_TOKEN)
    private readonly eventRepository: IEventRepository,
    @InjectEntityManager() private readonly manager: EntityManager,
  ) {}
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
    this.eventRepository.create(event, this.manager);

    this.eventEmitter.emit('statusUpdated', {
      urlId: event.urlId,
      status: true,
    });
  }
}
