import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import {
  EVENT_REPOSITORY_TOKEN,
  URL_READ_REPOSITORY_TOKEN,
  USER_READ_REPOSITORY_TOKEN,
} from '@infrastructure';
import { CreateUserReadEvent, DeleteUserEvent } from '../../event';
import { CreateUserReadCommand } from './create-user-read.command';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Inject } from '@nestjs/common';
import {
  IEventRepository,
  IUrlReadRepository,
  IUserReadRepository,
} from '@domain';
import { CreateUserReadDto, UpdateUserIdDto } from '@application';

@CommandHandler(CreateUserReadCommand)
export class CreateUserReadCommandHandler
  implements ICommandHandler<CreateUserReadCommand>
{
  constructor(
    @Inject(USER_READ_REPOSITORY_TOKEN)
    private readonly userReadRepository: IUserReadRepository,
    @Inject(URL_READ_REPOSITORY_TOKEN)
    private readonly urlReadRepository: IUrlReadRepository,
    @Inject(EVENT_REPOSITORY_TOKEN)
    private readonly eventRepository: IEventRepository,
    private readonly eventBus: EventBus,

    @InjectEntityManager() private readonly manager: EntityManager,
    @InjectEntityManager('read') private readonly readManager: EntityManager,
  ) {}

  async execute(command: CreateUserReadCommand) {
    try {
      await this.eventRepository.create(
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
        new UpdateUserIdDto(command.userId),
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
