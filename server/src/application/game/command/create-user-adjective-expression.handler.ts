import {
  CommandHandler,
  EventBus,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateUserAdjectiveExpressionCommand } from './create-user-adjective-expression.command';
import { ADJECTIVE_EXPRESSION_SERVICE_TOKEN } from '@infrastructure';
import { GameNextEvent } from '@domain';
import { IAdjectiveExpressionService } from '@interface';
import { CountUsersInRoomQuery } from '../../user';
import { CreateUserExpressionEvent } from '../event';

@CommandHandler(CreateUserAdjectiveExpressionCommand)
export class CreateUserAdjectiveExpressionHandler
  implements ICommandHandler<CreateUserAdjectiveExpressionCommand>
{
  constructor(
    @Inject(ADJECTIVE_EXPRESSION_SERVICE_TOKEN)
    private readonly adjectiveExpressionService: IAdjectiveExpressionService,
    private readonly queryBus: QueryBus,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateUserAdjectiveExpressionCommand): Promise<{
    next: boolean;
  }> {
    const { urlId, userId, expressionIdList } = command;

    const { saveResult, submitCount } =
      await this.adjectiveExpressionService.saveUserExpressionAndGetSubmitCount(
        {
          urlId,
          userId,
          expressionIdList,
        },
      );

    const { userCount } = await this.queryBus.execute(
      new CountUsersInRoomQuery(urlId),
    );

    this.eventBus.publish(
      new CreateUserExpressionEvent(
        saveResult[0].getUserId(),
        saveResult.map((list) => list.getAdjectiveExpressionId()),
        saveResult[0].getCreatedAt(),
      ),
    );

    this.eventBus.publish(new GameNextEvent(urlId));

    //submitCount이 무조건 userCount보다 1 작게 나온다
    //이유 : cud DB 저장 후 바로 read DB에 저장하는게 아니여서 데이터 불일치가 발생한다.
    //이를 막기 위해선 cud create, read create가 한 세트로 움직여야한다.
    if (submitCount + 1 === userCount) return { next: true };
    else return { next: false };
  }
}
