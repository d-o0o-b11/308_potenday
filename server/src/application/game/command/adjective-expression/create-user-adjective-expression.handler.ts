import {
  CommandHandler,
  EventBus,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateUserAdjectiveExpressionCommand } from './create-user-adjective-expression.command';
import { ADJECTIVE_EXPRESSION_SERVICE_TOKEN } from '@infrastructure';
import { IAdjectiveExpressionService } from '@interface';
import { CountUsersInRoomQuery } from '../../../user';
import { CreateUserExpressionEvent, GameNextEvent } from '../../event';
import { CreateUserExpressionAndGetSubmitCountDto } from '@application';

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

  async execute(command: CreateUserAdjectiveExpressionCommand) {
    const { urlId, userId, expressionIdList } = command;

    const { saveResult, submitCount } =
      await this.adjectiveExpressionService.saveUserExpressionAndGetSubmitCount(
        new CreateUserExpressionAndGetSubmitCountDto(
          urlId,
          userId,
          expressionIdList,
        ),
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

    // this.eventBus.publish(
    //   new GameNextEvent('AdjectiveExpressionGameNextEvent', 'event', urlId),
    // );

    //submitCount이 무조건 userCount보다 1 작게 나온다
    //이유 : cud DB 저장 후 바로 read DB에 저장하는게 아니여서 데이터 불일치가 발생한다.
    //이를 막기 위해선 cud create, read create가 한 세트로 움직여야한다.
    //saveUserExpressionAndGetSubmitCount 이걸 풀어버린다고 생각하면,,?
    //->adjectiveExpressionRepository.create 다음에 또는 내부에 같이 넣을 것 같은데 이벤트는 비동기 적으로 일어나서
    //이벤트 사용을 못한다 그러면
    //이벤트 사용하지 않기 vs 무조건 성공했다고 생각하고 +1
    //데이터 정합성이 떨어진다..ACID 일관성이 떨어진다
    if (submitCount + 1 === userCount) {
      this.eventBus.publish(
        new GameNextEvent('AdjectiveExpressionGameNextEvent', 'event', urlId),
      );
    }
  }
}
