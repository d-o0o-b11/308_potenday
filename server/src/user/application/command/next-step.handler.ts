import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserUrlFactory } from '../../domain';
import { NextStepCommand } from './next-step.command';

@CommandHandler(NextStepCommand)
export class NextStepHandler implements ICommandHandler<NextStepCommand> {
  constructor(private userUrlFactory: UserUrlFactory) {}

  async execute(command: NextStepCommand): Promise<void> {
    const { url } = command;

    this.userUrlFactory.update({ url: url, status: true });
  }
}
