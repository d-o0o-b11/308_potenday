import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUrlReadStatusCommand } from './update-url-read-status.command';
import {
  DeleteUpdateUrlStatusEvent,
  EventStore,
  UpdateUrlReadStatusEvent,
} from '../event';
import { UrlReadRepository } from '@infrastructure';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { UpdateUserUrlStatusDto } from '@interface';

@CommandHandler(UpdateUrlReadStatusCommand)
export class UpdateUrlReadStatusCommandHandler
  implements ICommandHandler<UpdateUrlReadStatusCommand>
{
  constructor(
    private readonly eventStore: EventStore,
    private readonly urlReadRepository: UrlReadRepository,
    private readonly eventBus: EventBus,
    @InjectEntityManager() private readonly manager: EntityManager,
    @InjectEntityManager('read') private readonly readManager: EntityManager,
  ) {}

  async execute(command: UpdateUrlReadStatusCommand) {
    try {
      await this.eventStore.saveEvent(
        new UpdateUrlReadStatusEvent(
          'UpdateUrlReadStatusCommand',
          'save',
          command.urlId,
          command.status,
        ),
        this.manager,
      );

      await this.urlReadRepository.updateStatus(
        command.urlId,
        new UpdateUserUrlStatusDto(command.status),
        this.readManager,
      );
    } catch (error) {
      this.eventBus.publish(
        new DeleteUpdateUrlStatusEvent(
          'DeleteUpdateUrlStatusEvent',
          'delete',
          command.urlId,
          command.status,
        ),
      );
    }
  }
}
