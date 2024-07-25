import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateStatusFalseCommand } from './update-url-status.command';
import { Inject } from '@nestjs/common';
import { UserUrlEventPublisher } from '../event';
import {
  USER_URL_EVENT_PUBLISHER,
  USER_URL_SERVICE_TOKEN,
} from '@infrastructure';
import { IUserUrlService } from '@interface';

@CommandHandler(UpdateStatusFalseCommand)
export class UpdateStatusFalseHandler
  implements ICommandHandler<UpdateStatusFalseCommand>
{
  constructor(
    @Inject(USER_URL_SERVICE_TOKEN)
    private userUrlService: IUserUrlService,
    @Inject(USER_URL_EVENT_PUBLISHER)
    private userUrlEventPublisher: UserUrlEventPublisher,
  ) {}

  async execute(command: UpdateStatusFalseCommand): Promise<void> {
    const { urlId } = command;

    await this.userUrlService.updateStatusFalse(urlId);

    this.userUrlEventPublisher.updateStatus({ urlId: urlId, status: true });
  }
}
