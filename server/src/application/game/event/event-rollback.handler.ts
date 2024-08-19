import {
  EVENT_REPOSITORY_TOKEN,
  ADJECTIVE_EXPRESSION_REPOSITORY_TOKEN,
  ADJECTIVE_EXPRESSION_REPOSITORY_READ_TOKEN,
} from '@infrastructure';
import { DeleteUserExpressionEvent } from './event-sourcing.event';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Inject } from '@nestjs/common';
import {
  IEventRepository,
  IAdjectiveExpressionRepository,
  IAdjectiveExpressionRepositoryRead,
} from '@domain';

@EventsHandler(DeleteUserExpressionEvent)
export class EventGameRollbackHandler
  implements IEventHandler<DeleteUserExpressionEvent>
{
  constructor(
    @Inject(EVENT_REPOSITORY_TOKEN)
    private readonly eventRepository: IEventRepository,
    @Inject(ADJECTIVE_EXPRESSION_REPOSITORY_READ_TOKEN)
    private readonly adjectiveExpressionReadRepository: IAdjectiveExpressionRepositoryRead,
    @Inject(ADJECTIVE_EXPRESSION_REPOSITORY_TOKEN)
    private adjectiveExpressionRepository: IAdjectiveExpressionRepository,

    @InjectEntityManager() private readonly manager: EntityManager,
    @InjectEntityManager('read') private readonly readManager: EntityManager,
  ) {}

  async handle(event: DeleteUserExpressionEvent) {
    switch (event.constructor) {
      case DeleteUserExpressionEvent:
        await this.handleDeleteUserExpressionEvent(
          event as DeleteUserExpressionEvent,
        );
        break;
      default:
        break;
    }
  }

  private async handleDeleteUserExpressionEvent(
    event: DeleteUserExpressionEvent,
  ) {
    try {
      await this.eventRepository.create(event, this.manager);
      await this.adjectiveExpressionReadRepository.delete(
        event.urlId,
        this.readManager,
      );
      await this.adjectiveExpressionRepository.delete(
        event.urlId,
        this.manager,
      );
    } catch (error) {
      console.error('Error processing DeleteUrlEvent:', error);
      //슬랙
    }
  }
}
