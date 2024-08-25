import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { NextStepCommand } from './next-step.command';
import { GameNextEvent, StatusUpdatedEvent } from '@domain';

@CommandHandler(NextStepCommand)
export class NextStepHandler implements ICommandHandler<NextStepCommand> {
  constructor(private readonly eventBus: EventBus) {}

  async execute(command: NextStepCommand): Promise<void> {
    const { urlId } = command;

    this.eventBus.publish(
      new GameNextEvent('NextStepGameNextEvent', 'event', urlId),
    );
    this.eventBus.publish(new StatusUpdatedEvent(urlId, true));
  }
}
