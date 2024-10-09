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
}
