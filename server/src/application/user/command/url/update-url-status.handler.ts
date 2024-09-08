import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdateStatusFalseCommand } from './update-url-status.command';
import { Inject } from '@nestjs/common';
import { UpdateUrlStatusEvent } from '../../event';
import { URL_SERVICE_TOKEN } from '@infrastructure';
import { IUrlService } from '@interface';
import { StatusUpdatedEvent } from '@domain';

@CommandHandler(UpdateStatusFalseCommand)
export class UpdateStatusFalseHandler
  implements ICommandHandler<UpdateStatusFalseCommand>
{
  constructor(
    @Inject(URL_SERVICE_TOKEN)
    private readonly urlService: IUrlService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateStatusFalseCommand): Promise<void> {
    const { urlId } = command;

    await this.urlService.updateStatusFalse(urlId);

    this.eventBus.publish(new UpdateUrlStatusEvent(urlId, false));
    this.eventBus.publish(new StatusUpdatedEvent(urlId, true));
  }
}
