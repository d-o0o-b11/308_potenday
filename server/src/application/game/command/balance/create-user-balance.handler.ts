import {
  CommandHandler,
  EventBus,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateUserBalanceCommand } from './create-user-balance.command';
import { BALANCE_SERVICE_TOKEN } from '@infrastructure';
import { IBalanceService } from '@interface';
import {
  CountUsersInRoomQuery,
  CreateUserBalanceAndGetSubmitCountDto,
  CreateUserBalanceEvent,
  GameNextEvent,
} from '@application';

@CommandHandler(CreateUserBalanceCommand)
export class CreateUserBalanceCommandHandler
  implements ICommandHandler<CreateUserBalanceCommand>
{
  constructor(
    private readonly queryBus: QueryBus,
    private readonly eventBus: EventBus,
    @Inject(BALANCE_SERVICE_TOKEN)
    private readonly balanceService: IBalanceService,
  ) {}

  async execute(command: CreateUserBalanceCommand): Promise<void> {
    const { urlId, userId, balanceId, balanceType } = command;

    const { submitCount, saveResult } =
      await this.balanceService.saveUserExpressionAndGetSubmitCount(
        new CreateUserBalanceAndGetSubmitCountDto(
          urlId,
          userId,
          balanceId,
          balanceType,
        ),
      );

    const { userCount } = await this.queryBus.execute(
      new CountUsersInRoomQuery(urlId),
    );

    this.eventBus.publish(
      new CreateUserBalanceEvent(
        saveResult.getUserId(),
        saveResult.getBalanceId(),
        saveResult.getBalanceType(),
        saveResult.getCreatedAt(),
      ),
    );

    //submitCount이 무조건 userCount보다 1 작게 나온다
    //이유 : cud DB 저장 후 바로 read DB에 저장하는게 아니여서 데이터 불일치가 발생한다.
    //이를 막기 위해선 cud create, read create가 한 세트로 움직여야한다.
    //+1 지우는게 목표
    if (submitCount + 1 === userCount) {
      this.eventBus.publish(
        new GameNextEvent('BalanceGameNextEvent', 'event', urlId),
      );
    }
  }
}
