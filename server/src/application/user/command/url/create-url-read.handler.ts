import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateUrlReadCommand } from './create-url-read.command';
import {
  EVENT_REPOSITORY_TOKEN,
  URL_READ_REPOSITORY_TOKEN,
} from '@infrastructure';
import { CreateUrlReadEvent, DeleteUrlEvent } from '../../event';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Inject } from '@nestjs/common';
import { IEventRepository, IUrlReadRepository } from '@domain';
import { CreateUserUrlReadDto } from '@application';

@CommandHandler(CreateUrlReadCommand)
export class CreateUrlReadCommandHandler
  implements ICommandHandler<CreateUrlReadCommand>
{
  constructor(
    @Inject(URL_READ_REPOSITORY_TOKEN)
    private readonly urlReadRepository: IUrlReadRepository,
    @Inject(EVENT_REPOSITORY_TOKEN)
    private readonly eventRepository: IEventRepository,
    private readonly eventBus: EventBus,

    @InjectEntityManager() private readonly manager: EntityManager,
    @InjectEntityManager('read') private readonly readManager: EntityManager,
  ) {}

  async execute(command: CreateUrlReadCommand) {
    try {
      await this.eventRepository.create(
        new CreateUrlReadEvent(
          'CreateUrlReadCommand',
          'save',
          command.urlId,
          command.url,
          command.status,
          command.createdAt,
          command.updatedAt,
          command.deletedAt,
        ),
        this.manager,
      );

      await this.urlReadRepository.create(
        new CreateUserUrlReadDto(
          command.urlId,
          command.url,
          command.status,
          command.createdAt,
          command.updatedAt,
          command.deletedAt,
        ),
        this.readManager,
      );
    } catch (error) {
      this.eventBus.publish(
        new DeleteUrlEvent('DeleteUrlEvent', 'delete', command.urlId),
      );
      // throw error;
    }
  }
}
