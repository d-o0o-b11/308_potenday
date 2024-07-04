import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateUserAdjectiveExpressionCommand } from './create-user-adjective-expression.command';
import { USER_ADJECTIVE_EXPRESSION_SERVICE_TOKEN } from '../../infrastructure';
import { GameNextFactory } from '../../domain';
import { CountUsersInRoomQuery } from '@user';
import { IUserAdjectiveExpressionService } from '../../interface';

@CommandHandler(CreateUserAdjectiveExpressionCommand)
export class CreateUserAdjectiveExpressionHandler
  implements ICommandHandler<CreateUserAdjectiveExpressionCommand>
{
  constructor(
    private gameNextFactory: GameNextFactory,
    @Inject(USER_ADJECTIVE_EXPRESSION_SERVICE_TOKEN)
    private userAdjectiveExpressionService: IUserAdjectiveExpressionService,
    private queryBus: QueryBus,
  ) {}

  async execute(command: CreateUserAdjectiveExpressionCommand): Promise<{
    next: boolean;
  }> {
    const { urlId, userId, expressionIds } = command;

    const { submitCount } =
      await this.userAdjectiveExpressionService.saveUserExpressionAndGetSubmitCount(
        {
          urlId,
          userId,
          expressionIds,
        },
      );

    const { userCount } = await this.queryBus.execute(
      new CountUsersInRoomQuery(urlId),
    );

    this.gameNextFactory.create(urlId);

    if (submitCount === userCount) return { next: true };
    else return { next: false };
  }
}
