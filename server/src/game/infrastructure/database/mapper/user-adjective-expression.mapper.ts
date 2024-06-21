import { UserAdjectiveExpression } from '../../../domain';
import { UserAdjectiveExpressionEntity } from '../entity';

export class UserAdjectiveExpressionMapper {
  static toEntities(
    userId: number,
    adjectiveExpressionIds: number[],
  ): UserAdjectiveExpressionEntity[] {
    return adjectiveExpressionIds.map((expressionId) => {
      const entity = new UserAdjectiveExpressionEntity();
      entity.userId = userId;
      entity.adjectiveExpressionId = expressionId;
      return entity;
    });
  }

  static toDomainEntities(
    entities: UserAdjectiveExpressionEntity[],
  ): UserAdjectiveExpression[] {
    return entities.map((entity) => this.toDomainEntity(entity));
  }

  static toDomainEntity(
    entity: UserAdjectiveExpressionEntity,
  ): UserAdjectiveExpression {
    return new UserAdjectiveExpression(
      entity.id,
      entity.userId,
      entity.adjectiveExpression.adjective,
      entity.user.nickName,
      entity.user.imgId,
    );
  }
}
