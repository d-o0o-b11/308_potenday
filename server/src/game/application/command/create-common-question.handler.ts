import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { COMMON_QUESTION_REPOSITORY_TOKEN } from '../../infrastructure';
import { ICommonQuestionRepository } from '../../domain';

import { CreateCommonQuestionCommand } from './create-common-question.command';

@CommandHandler(CreateCommonQuestionCommand)
export class CreateCommonQuestionCommandHandler
  implements ICommandHandler<CreateCommonQuestionCommand>
{
  constructor(
    @Inject(COMMON_QUESTION_REPOSITORY_TOKEN)
    private commonQuestionRepository: ICommonQuestionRepository,
  ) {}

  async execute(command: CreateCommonQuestionCommand): Promise<void> {
    const { urlId } = command;

    await this.commonQuestionRepository.save({ urlId });
  }
}
