import { instanceToPlain, plainToInstance } from 'class-transformer';
import { UserAdjectiveExpressionEntity } from '../entities/user-adjective-expression.entity';

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
}
