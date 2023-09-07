import { instanceToPlain, plainToInstance } from 'class-transformer';
import { UserAdjectiveExpressionEntity } from '../entities/user-adjective-expression.entity';
import { SaveUserBalance } from '../dto/save-balance-game.dto';
import { UserBalanceGameEntity } from '../entities/user-balance-game.entity';

export class GameKindMapper {
  static toUserAdjectiveExpressionEntity(
    user_id: number,
    expression_id: number,
  ) {
    const userAdjectiveExpression = instanceToPlain({
      user_id: user_id,
      expression_id: expression_id,
    } as UserAdjectiveExpressionEntity);

    return plainToInstance(
      UserAdjectiveExpressionEntity,
      userAdjectiveExpression,
    );
  }

  static toBalanceGameEntity(dto: SaveUserBalance) {
    const userBalanceGame = instanceToPlain({
      url_id: dto.url_id,
      user_id: dto.user_id,
      balance_id: dto.balance_id,
      balance_type: dto.balance_type,
    } as unknown as UserBalanceGameEntity);

    return plainToInstance(UserBalanceGameEntity, userBalanceGame);
  }
}
