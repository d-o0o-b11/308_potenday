import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateUserBalanceCommand } from './create-user-balance.command';
import { GameNextFactory } from '@domain';
import { USER_BALANCE_SERVICE_TOKEN } from '@infrastructure';
import { IUserBalanceService } from '@interface';
import { CountUsersInRoomQuery } from '@application';

@CommandHandler(CreateUserBalanceCommand)
export class CreateUserBalanceCommandHandler
  implements ICommandHandler<CreateUserBalanceCommand>
{
  constructor(
    private queryBus: QueryBus,
    private readonly gameNextFactory: GameNextFactory,
    @Inject(USER_BALANCE_SERVICE_TOKEN)
    private readonly userBalanceService: IUserBalanceService,
  ) {}

  async execute(command: CreateUserBalanceCommand): Promise<void> {
    const { urlId, userId, balanceId, balanceType } = command;

    const { submitCount } =
      await this.userBalanceService.saveUserExpressionAndGetSubmitCount({
        userId,
        balanceId,
        balanceType,
        urlId,
      });

    const { userCount } = await this.queryBus.execute(
      new CountUsersInRoomQuery(urlId),
    );

    if (submitCount === userCount) {
      this.gameNextFactory.create(urlId);
    }
  }
}
