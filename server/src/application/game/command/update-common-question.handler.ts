import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UpdateCommonQuestionCommand } from './update-common-question.command';
import { GameNextEvent, ICommonQuestionRepository } from '@domain';
import { COMMON_QUESTION_REPOSITORY_TOKEN } from '@infrastructure';

@CommandHandler(UpdateCommonQuestionCommand)
export class UpdateCommonQuestionCommandHandler
  implements ICommandHandler<UpdateCommonQuestionCommand>
{
  constructor(
    private readonly eventBus: EventBus,
    @Inject(COMMON_QUESTION_REPOSITORY_TOKEN)
    private readonly commonQuestionRepository: ICommonQuestionRepository,
  ) {}

  async execute(command: UpdateCommonQuestionCommand): Promise<void> {
    const { urlId, questionId } = command;

    await this.commonQuestionRepository.update({ urlId, questionId });

    this.eventBus.publish(new GameNextEvent(urlId));
  }
}
