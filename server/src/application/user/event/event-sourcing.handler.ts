import { NextStepEvent } from './event-sourcing.event';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { EVENT_REPOSITORY_TOKEN } from '@infrastructure';
import { Inject } from '@nestjs/common';
import { IEventRepository } from '@domain';

@EventsHandler(NextStepEvent)
export class EventSourcingHandler implements IEventHandler<NextStepEvent> {
  constructor(
    @Inject(EVENT_REPOSITORY_TOKEN)
    private readonly eventRepository: IEventRepository,
    @InjectEntityManager() private readonly manager: EntityManager,
  ) {}

  async handle(event: NextStepEvent) {
    switch (event.constructor) {
      case NextStepEvent:
        await this.handleNextStepEvent(event as NextStepEvent);
        break;
      default:
        break;
    }
  }

  private async handleNextStepEvent(event: NextStepEvent) {
    this.eventRepository.create(event, this.manager);
  }
}
