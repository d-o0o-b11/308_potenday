import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UrlReadRepository, UserReadRepository } from '@infrastructure';
import { CreateUserReadDto } from '@interface';
import {
  CreateUserReadEvent,
  DeleteUserEvent,
} from '../event/event-sourcing.event';
import { CreateUserReadCommand } from './create-user-read.command';
import { EventStore } from '../event';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@CommandHandler(CreateUserReadCommand)
export class CreateUserReadCommandHandler
  implements ICommandHandler<CreateUserReadCommand>
{
  constructor(
    private readonly eventStore: EventStore,
    private readonly userReadRepository: UserReadRepository,
    private readonly urlReadRepository: UrlReadRepository,
    private readonly eventBus: EventBus,
    @InjectEntityManager() private readonly manager: EntityManager,
    @InjectEntityManager('read') private readonly readManager: EntityManager,
  ) {}

  async execute(command: CreateUserReadCommand) {
    try {
      await this.eventStore.saveEvent(
        new CreateUserReadEvent(
          'CreateUserReadCommand',
          'save',
          command.userId,
          command.imgId,
          command.nickName,
          command.urlId,
          command.createdAt,
          command.updatedAt,
          command.deletedAt,
        ),
        this.manager,
      );

      await this.userReadRepository.create(
        new CreateUserReadDto(
          command.userId,
          command.imgId,
          command.nickName,
          command.urlId,
          command.createdAt,
          command.updatedAt,
          command.deletedAt,
        ),
        this.readManager,
      );

      await this.urlReadRepository.updateUserList(
        command.urlId,
        command.userId,
        this.readManager,
      );
    } catch (error) {
      this.eventBus.publish(
        new DeleteUserEvent(
          'DeleteUserEvent',
          'delete',
          command.userId,
          command.userId,
        ),
      );
    }
  }
}
