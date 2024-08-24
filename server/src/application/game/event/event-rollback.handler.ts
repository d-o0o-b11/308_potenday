import {
  EVENT_REPOSITORY_TOKEN,
  ADJECTIVE_EXPRESSION_REPOSITORY_TOKEN,
  ADJECTIVE_EXPRESSION_REPOSITORY_READ_TOKEN,
  BALANCE_REPOSITORY_TOKEN,
  BALANCE_READ_REPOSITORY_TOKEN,
} from '@infrastructure';
import {
  DeleteUserBalanceEvent,
  DeleteUserExpressionEvent,
} from './event-sourcing.event';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Inject } from '@nestjs/common';
import {
  IEventRepository,
  IAdjectiveExpressionRepository,
  IAdjectiveExpressionRepositoryRead,
  IBalanceRepository,
  IBalanceReadRepository,
} from '@domain';
import { DeleteUserBalanceDto, DeleteUserBalanceReadDto } from '@interface';

@EventsHandler(DeleteUserExpressionEvent, DeleteUserBalanceEvent)
export class EventGameRollbackHandler
  implements IEventHandler<DeleteUserExpressionEvent | DeleteUserBalanceEvent>
{
  constructor(
    @Inject(EVENT_REPOSITORY_TOKEN)
    private readonly eventRepository: IEventRepository,
    @Inject(ADJECTIVE_EXPRESSION_REPOSITORY_READ_TOKEN)
    private readonly adjectiveExpressionReadRepository: IAdjectiveExpressionRepositoryRead,
    @Inject(ADJECTIVE_EXPRESSION_REPOSITORY_TOKEN)
    private readonly adjectiveExpressionRepository: IAdjectiveExpressionRepository,
    @Inject(BALANCE_READ_REPOSITORY_TOKEN)
    private readonly balanceReadRepository: IBalanceReadRepository,
    @Inject(BALANCE_REPOSITORY_TOKEN)
    private readonly balanceRepository: IBalanceRepository,

    @InjectEntityManager() private readonly manager: EntityManager,
    @InjectEntityManager('read') private readonly readManager: EntityManager,
  ) {}

  async handle(event: DeleteUserExpressionEvent | DeleteUserBalanceEvent) {
    switch (event.constructor) {
      case DeleteUserExpressionEvent:
        await this.handleDeleteUserExpressionEvent(
          event as DeleteUserExpressionEvent,
        );
        break;
      case DeleteUserBalanceEvent:
        await this.handleDeleteUserBalanceEvent(
          event as DeleteUserBalanceEvent,
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

  private async handleDeleteUserBalanceEvent(event: DeleteUserBalanceEvent) {
    try {
      await this.eventRepository.create(event, this.manager);
      await this.balanceReadRepository.delete(
        new DeleteUserBalanceReadDto(event.userId, event.balanceId),
        this.readManager,
      );
      await this.balanceRepository.delete(
        new DeleteUserBalanceDto(event.userId, event.balanceId),
        this.manager,
      );
    } catch (error) {
      console.error('Error processing DeleteUserBalanceEvent:', error);
      //슬랙
    }
  }
}
