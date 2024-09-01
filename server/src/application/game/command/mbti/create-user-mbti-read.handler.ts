import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import {
  EVENT_REPOSITORY_TOKEN,
  MBTI_REPOSITORY_READ_TOKEN,
} from '@infrastructure';
import { Inject } from '@nestjs/common';
import { IEventRepository, IMbtiReadRepository } from '@domain';
import { CreateUserMbtiReadEvent, DeleteUserMbtiEvent } from '../../event';
import { CreateUserMbtiReadCommand } from './create-user-mbti-read.command';
import { CreateMbtiReadDto } from '@application';

@CommandHandler(CreateUserMbtiReadCommand)
export class CreateUserMbtiReadCommandHandler
  implements ICommandHandler<CreateUserMbtiReadCommand>
{
  constructor(
    @Inject(EVENT_REPOSITORY_TOKEN)
    private readonly eventRepository: IEventRepository,
    @Inject(MBTI_REPOSITORY_READ_TOKEN)
    private readonly mbtiReadRepository: IMbtiReadRepository,

    private readonly eventBus: EventBus,
    @InjectEntityManager() private readonly manager: EntityManager,
    @InjectEntityManager('read') private readonly readManager: EntityManager,
  ) {}

  async execute(command: CreateUserMbtiReadCommand) {
    try {
      await this.eventRepository.create(
        new CreateUserMbtiReadEvent(
          'CreateUserMbtiReadEvent',
          'save',
          command.userId,
          command.mbti,
          command.toUserId,
          command.createdAt,
        ),
        this.manager,
      );

      await this.mbtiReadRepository.create(
        new CreateMbtiReadDto(
          command.mbtiId,
          command.userId,
          command.mbti,
          command.toUserId,
          command.createdAt,
        ),
        this.readManager,
      );
    } catch (error) {
      this.eventBus.publish(
        new DeleteUserMbtiEvent(
          'DeleteUserMbtiEvent',
          'delete',
          command.userId,
          command.mbtiId,
        ),
      );
    }
  }
}
