import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserExpressionReadCommand } from './create-user-adjective-expression-read.command';
import { CreateUserAdjectiveExpressionReadDto } from '@interface';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import {
  CreateUserExpressionReadEvent,
  DeleteUserExpressionEvent,
} from '../event/event-sourcing.event';
import {
  ADJECTIVE_EXPRESSION_REPOSITORY_READ_TOKEN,
  EVENT_REPOSITORY_TOKEN,
} from '@infrastructure';
import { Inject } from '@nestjs/common';
import { IAdjectiveExpressionRepositoryRead, IEventRepository } from '@domain';

@CommandHandler(CreateUserExpressionReadCommand)
export class CreateUserExpressionReadCommandHandler
  implements ICommandHandler<CreateUserExpressionReadCommand>
{
  constructor(
    @Inject(ADJECTIVE_EXPRESSION_REPOSITORY_READ_TOKEN)
    private readonly adjectiveExpressionReadRepository: IAdjectiveExpressionRepositoryRead,
    @Inject(EVENT_REPOSITORY_TOKEN)
    private readonly eventRepository: IEventRepository,

    private readonly eventBus: EventBus,
    @InjectEntityManager() private readonly manager: EntityManager,
    @InjectEntityManager('read') private readonly readManager: EntityManager,
  ) {}

  async execute(command: CreateUserExpressionReadCommand) {
    try {
      await this.eventRepository.create(
        new CreateUserExpressionReadEvent(
          'CreateUserExpressionReadCommand',
          'save',
          command.userId,
          command.adjectiveExpressionIdList,
        ),
        this.manager,
      );

      await this.adjectiveExpressionReadRepository.create(
        new CreateUserAdjectiveExpressionReadDto(
          command.userId,
          command.adjectiveExpressionIdList,
          command.createdAt,
        ),
        this.readManager,
      );
    } catch (error) {
      this.eventBus.publish(
        new DeleteUserExpressionEvent(
          'DeleteUserExpressionEvent',
          'delete',
          command.userId,
        ),
      );
    }
  }
}
