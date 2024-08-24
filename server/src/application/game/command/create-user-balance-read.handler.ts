import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateBalanceReadDto } from '@interface';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import {
  BALANCE_READ_REPOSITORY_TOKEN,
  EVENT_REPOSITORY_TOKEN,
} from '@infrastructure';
import { Inject } from '@nestjs/common';
import { IBalanceReadRepository, IEventRepository } from '@domain';
import { CreateUserBalanceReadCommand } from './create-user-balance-read.command';
import { CreateUserBalanceReadEvent, DeleteUserBalanceEvent } from '../event';

@CommandHandler(CreateUserBalanceReadCommand)
export class CreateUserBalanceReadCommandHandler
  implements ICommandHandler<CreateUserBalanceReadCommand>
{
  constructor(
    @Inject(EVENT_REPOSITORY_TOKEN)
    private readonly eventRepository: IEventRepository,
    @Inject(BALANCE_READ_REPOSITORY_TOKEN)
    private readonly balanceReadRepository: IBalanceReadRepository,

    private readonly eventBus: EventBus,
    @InjectEntityManager() private readonly manager: EntityManager,
    @InjectEntityManager('read') private readonly readManager: EntityManager,
  ) {}

  async execute(command: CreateUserBalanceReadCommand) {
    try {
      await this.eventRepository.create(
        new CreateUserBalanceReadEvent(
          'CreateUserBalanceReadEvent',
          'save',
          command.userId,
          command.balanceId,
          command.balanceType,
          command.createdAt,
        ),
        this.manager,
      );

      await this.balanceReadRepository.create(
        new CreateBalanceReadDto(
          command.userId,
          command.balanceId,
          command.balanceType,
          command.createdAt,
        ),
        this.readManager,
      );
    } catch (error) {
      this.eventBus.publish(
        new DeleteUserBalanceEvent(
          'DeleteUserBalanceEvent',
          'delete',
          command.userId,
          command.balanceId,
        ),
      );
    }
  }
}
