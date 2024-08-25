import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { NextCommonQuestionCommand } from './next-common-question.command';
import { GameNextEvent } from '@domain';

@CommandHandler(NextCommonQuestionCommand)
export class NextCommonQuestionCommandHandler
  implements ICommandHandler<NextCommonQuestionCommand>
{
  constructor(private readonly eventBus: EventBus) {}

  async execute(command: NextCommonQuestionCommand): Promise<void> {
    const { urlId } = command;

    this.eventBus.publish(
      new GameNextEvent('CommonQuestionGameNextEvent', 'event', urlId),
    );
  }
}
