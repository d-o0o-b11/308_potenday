import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateStatusFalseCommand } from './update-url-status.command';
import { UserUrlFactory } from '../../domain';
import { Inject } from '@nestjs/common';
import { IUserUrlService } from '../../interface';
import { USER_URL_SERVICE_TOKEN } from '../../infrastructure';

@CommandHandler(UpdateStatusFalseCommand)
export class UpdateStatusFalseHandler
  implements ICommandHandler<UpdateStatusFalseCommand>
{
  constructor(
    private userUrlFactory: UserUrlFactory,
    @Inject(USER_URL_SERVICE_TOKEN)
    private userUrlService: IUserUrlService,
  ) {}

  async execute(command: UpdateStatusFalseCommand): Promise<void> {
    const { urlId } = command;

    await this.userUrlService.updateStatusFalse(urlId);

    this.userUrlFactory.update({ urlId: urlId, status: true });
  }
}
