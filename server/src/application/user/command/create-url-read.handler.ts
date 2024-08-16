import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateUrlReadCommand } from './create-url-read.command';
import { UrlReadRepository } from '@infrastructure';
import { CreateUserUrlReadDto } from '@interface';
import { CreateUrlReadEvent, DeleteUrlEvent, EventStore } from '../event';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@CommandHandler(CreateUrlReadCommand)
export class CreateUrlReadCommandHandler
  implements ICommandHandler<CreateUrlReadCommand>
{
  constructor(
    private readonly urlReadRepository: UrlReadRepository,
    private readonly eventStore: EventStore,
    private readonly eventBus: EventBus,
    @InjectEntityManager() private readonly manager: EntityManager,
    @InjectEntityManager('read') private readonly readManager: EntityManager,
  ) {}

  async execute(command: CreateUrlReadCommand) {
    try {
      await this.eventStore.saveEvent(
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
      throw error;
    }
  }
}
