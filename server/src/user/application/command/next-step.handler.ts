import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NextStepCommand } from './next-step.command';
import { Inject } from '@nestjs/common';
import { UserUrlEventPublisher } from '../event';
import { USER_URL_EVENT_PUBLISHER } from '../../infrastructure';

@CommandHandler(NextStepCommand)
export class NextStepHandler implements ICommandHandler<NextStepCommand> {
  constructor(
    @Inject(USER_URL_EVENT_PUBLISHER)
    private userUrlEventPublisher: UserUrlEventPublisher,
  ) {}

  async execute(command: NextStepCommand): Promise<void> {
    const { urlId } = command;

    this.userUrlEventPublisher.updateStatus({ urlId: urlId, status: true });
  }
}
