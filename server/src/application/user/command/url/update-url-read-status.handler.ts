import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUrlReadStatusCommand } from './update-url-read-status.command';
import {
  DeleteUpdateUrlStatusEvent,
  UpdateUrlReadStatusEvent,
} from '../../event';
import {
  EVENT_REPOSITORY_TOKEN,
  URL_READ_REPOSITORY_TOKEN,
} from '@infrastructure';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Inject } from '@nestjs/common';
import { IEventRepository, IUrlReadRepository } from '@domain';
import { UpdateUserUrlStatusDto } from '@application';

@CommandHandler(UpdateUrlReadStatusCommand)
export class UpdateUrlReadStatusCommandHandler
  implements ICommandHandler<UpdateUrlReadStatusCommand>
{
  constructor(
    @Inject(EVENT_REPOSITORY_TOKEN)
    private readonly eventRepository: IEventRepository,
    @Inject(URL_READ_REPOSITORY_TOKEN)
    private readonly urlReadRepository: IUrlReadRepository,
    private readonly eventBus: EventBus,
    @InjectEntityManager() private readonly manager: EntityManager,
    @InjectEntityManager('read') private readonly readManager: EntityManager,
  ) {}

  async execute(command: UpdateUrlReadStatusCommand) {
    try {
      await this.eventRepository.create(
        new UpdateUrlReadStatusEvent(
          'UpdateUrlReadStatusCommand',
          'update',
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
          'update',
          command.urlId,
          command.status,
        ),
      );
    }
  }
}
