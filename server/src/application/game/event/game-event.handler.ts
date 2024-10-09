import { IEventRepository } from '@domain';
import { EVENT_REPOSITORY_TOKEN } from '@infrastructure';
import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { GameNextEvent } from './game-next.event';

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

    //TODO text로 이벤트 등록할 경우 오타 발생할 수 있다 -> 변수에 담아서 변수를 쓰는 방안으로 가자
    this.eventEmitter.emit('statusUpdated', {
      urlId: event.urlId,
      status: true,
    });
  }
}
