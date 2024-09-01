import {
  EVENT_REPOSITORY_TOKEN,
  ADJECTIVE_EXPRESSION_REPOSITORY_TOKEN,
  ADJECTIVE_EXPRESSION_REPOSITORY_READ_TOKEN,
  BALANCE_REPOSITORY_TOKEN,
  BALANCE_READ_REPOSITORY_TOKEN,
  MBTI_REPOSITORY_TOKEN,
  MBTI_REPOSITORY_READ_TOKEN,
} from '@infrastructure';
import {
  DeleteUserBalanceEvent,
  DeleteUserExpressionEvent,
  DeleteUserMbtiEvent,
} from './event-sourcing.event';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Inject } from '@nestjs/common';
import {
  IEventRepository,
  IAdjectiveExpressionRepository,
  IAdjectiveExpressionRepositoryReadRepository,
  IBalanceRepository,
  IBalanceReadRepository,
  IMbtiRepository,
  IMbtiReadRepository,
} from '@domain';
import {
  DeleteUserBalanceDto,
  DeleteUserBalanceReadDto,
  DeleteUserMbtiReadDto,
} from '../dto';

@EventsHandler(
  DeleteUserExpressionEvent,
  DeleteUserBalanceEvent,
  DeleteUserMbtiEvent,
)
export class EventGameRollbackHandler
  implements
    IEventHandler<
      DeleteUserExpressionEvent | DeleteUserBalanceEvent | DeleteUserMbtiEvent
    >
{
  constructor(
    @Inject(EVENT_REPOSITORY_TOKEN)
    private readonly eventRepository: IEventRepository,
    @Inject(ADJECTIVE_EXPRESSION_REPOSITORY_READ_TOKEN)
    private readonly adjectiveExpressionReadRepository: IAdjectiveExpressionRepositoryReadRepository,
    @Inject(ADJECTIVE_EXPRESSION_REPOSITORY_TOKEN)
    private readonly adjectiveExpressionRepository: IAdjectiveExpressionRepository,
    @Inject(BALANCE_READ_REPOSITORY_TOKEN)
    private readonly balanceReadRepository: IBalanceReadRepository,
    @Inject(BALANCE_REPOSITORY_TOKEN)
    private readonly balanceRepository: IBalanceRepository,
    @Inject(MBTI_REPOSITORY_READ_TOKEN)
    private readonly mbtiReadRepository: IMbtiReadRepository,
    @Inject(MBTI_REPOSITORY_TOKEN)
    private readonly mbtiRepository: IMbtiRepository,

    @InjectEntityManager() private readonly manager: EntityManager,
    @InjectEntityManager('read') private readonly readManager: EntityManager,
  ) {}

  async handle(
    event:
      | DeleteUserExpressionEvent
      | DeleteUserBalanceEvent
      | DeleteUserMbtiEvent,
  ) {
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
      case DeleteUserMbtiEvent:
        await this.handleDeleteUserMbtiEvent(event as DeleteUserMbtiEvent);
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

  private async handleDeleteUserMbtiEvent(event: DeleteUserMbtiEvent) {
    try {
      await this.eventRepository.create(event, this.manager);
      await this.mbtiReadRepository.delete(
        new DeleteUserMbtiReadDto(event.mbtiId, event.userId),
        this.readManager,
      );
      await this.mbtiRepository.delete(event.mbtiId, this.manager);
    } catch (error) {
      console.error('Error processing DeleteUserMbtiEvent:', error);
      //슬랙
    }
  }
}
