import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { COMMON_QUESTION_REPOSITORY_TOKEN } from '../../infrastructure';
import { ICommonQuestionRepository, GameNextFactory } from '../../domain';
import { UpdateCommonQuestionCommand } from './update-common-question.command';

@CommandHandler(UpdateCommonQuestionCommand)
export class UpdateCommonQuestionCommandHandler
  implements ICommandHandler<UpdateCommonQuestionCommand>
{
  constructor(
    private gameNextFactory: GameNextFactory,
    @Inject(COMMON_QUESTION_REPOSITORY_TOKEN)
    private commonQuestionRepository: ICommonQuestionRepository,
  ) {}

  async execute(command: UpdateCommonQuestionCommand): Promise<void> {
    const { urlId, questionId } = command;

    await this.commonQuestionRepository.update({ urlId, questionId });

    this.gameNextFactory.create(urlId);
  }
}
