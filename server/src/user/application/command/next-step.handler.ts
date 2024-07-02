import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserUrlFactory } from '../../domain';
import { NextStepCommand } from './next-step.command';

@CommandHandler(NextStepCommand)
export class NextStepHandler implements ICommandHandler<NextStepCommand> {
  constructor(private userUrlFactory: UserUrlFactory) {}

  async execute(command: NextStepCommand): Promise<void> {
    const { urlId } = command;

    this.userUrlFactory.update({ urlId: urlId, status: true });
  }
}
