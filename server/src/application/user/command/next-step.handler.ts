import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { NextStepCommand } from './next-step.command';
import { StatusUpdatedEvent } from '@domain';
import { NextStepEvent } from '../event';

@CommandHandler(NextStepCommand)
export class NextStepHandler implements ICommandHandler<NextStepCommand> {
  constructor(private readonly eventBus: EventBus) {}

  async execute(command: NextStepCommand): Promise<void> {
    const { urlId } = command;

    this.eventBus.publish(new NextStepEvent('NextStepCommand', 'event', urlId));
    this.eventBus.publish(new StatusUpdatedEvent(urlId, true));
  }
}
