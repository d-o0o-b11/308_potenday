import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateUserAdjectiveExpressionCommand } from './create-user-adjective-expression.command';
import { USER_ADJECTIVE_EXPRESSION_REPOSITORY_TOKEN } from '../../infrastructure';
import {
  IUserAdjectiveExpressionRepository,
  GameNextFactory,
} from '../../domain';
import { CountUsersInRoomQuery } from '@user';

@CommandHandler(CreateUserAdjectiveExpressionCommand)
export class CreateUserAdjectiveExpressionHandler
  implements ICommandHandler<CreateUserAdjectiveExpressionCommand>
{
  constructor(
    private gameNextFactory: GameNextFactory,
    @Inject(USER_ADJECTIVE_EXPRESSION_REPOSITORY_TOKEN)
    private userRepository: IUserAdjectiveExpressionRepository,
    private queryBus: QueryBus,
  ) {}

  async execute(command: CreateUserAdjectiveExpressionCommand): Promise<{
    next: boolean;
  }> {
    const { url, urlId, userId, expressionIds } = command;

    await this.userRepository.save(userId, expressionIds);

    const submitCount = (await this.userRepository.find(urlId)).length;
    const { userCount } = await this.queryBus.execute(
      new CountUsersInRoomQuery(url),
    );

    this.gameNextFactory.create(urlId);

    if (submitCount === userCount) return { next: true };
    else return { next: false };
  }
}
