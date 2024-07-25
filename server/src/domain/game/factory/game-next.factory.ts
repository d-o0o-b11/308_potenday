import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { GameNextEvent } from '../game-next.event';

@Injectable()
export class GameNextFactory {
  constructor(private eventBus: EventBus) {}

  /**
   * 형용사 표현 선택 후
   * 이벤트 발행
   */
  create(urlId: number) {
    this.eventBus.publish(new GameNextEvent(urlId));
  }
}
