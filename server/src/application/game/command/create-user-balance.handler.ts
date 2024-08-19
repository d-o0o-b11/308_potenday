import {
  CommandHandler,
  EventBus,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateUserBalanceCommand } from './create-user-balance.command';
import { GameNextEvent } from '@domain';
import { USER_BALANCE_SERVICE_TOKEN } from '@infrastructure';
import { IUserBalanceService } from '@interface';
import { CountUsersInRoomQuery } from '@application';

@CommandHandler(CreateUserBalanceCommand)
export class CreateUserBalanceCommandHandler
  implements ICommandHandler<CreateUserBalanceCommand>
{
  constructor(
    private readonly queryBus: QueryBus,
    private readonly eventBus: EventBus,
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
      this.eventBus.publish(new GameNextEvent(urlId));
    }
  }
}
