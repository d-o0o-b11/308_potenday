import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdateStatusFalseCommand } from './update-url-status.command';
import { Inject } from '@nestjs/common';
import { UpdateUrlStatusEvent } from '../event';
import { USER_URL_SERVICE_TOKEN } from '@infrastructure';
import { IUrlService } from '@interface';
import { StatusUpdatedEvent } from '@domain';

@CommandHandler(UpdateStatusFalseCommand)
export class UpdateStatusFalseHandler
  implements ICommandHandler<UpdateStatusFalseCommand>
{
  constructor(
    @Inject(USER_URL_SERVICE_TOKEN)
    private userUrlService: IUrlService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateStatusFalseCommand): Promise<void> {
    const { urlId } = command;

    await this.userUrlService.updateStatusFalse(urlId);

    this.eventBus.publish(new UpdateUrlStatusEvent(urlId, false));
    this.eventBus.publish(new StatusUpdatedEvent(urlId, true));
  }
}
