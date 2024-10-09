import {
  UserAdjectiveExpressionEntity,
  UserAdjectiveExpressionMapper,
} from '@infrastructure';

describe('UserAdjectiveExpressionMapper', () => {
  describe('toEntities', () => {
    it('UserAdjectiveExpressionEntity 인스턴스 배열을 반환합니다.', () => {
      const userId = 1;
      const adjectiveExpressionIds = [10, 20, 30];

      const entities = UserAdjectiveExpressionMapper.toEntities(
        userId,
        adjectiveExpressionIds,
      );

      expect(entities.length).toBe(adjectiveExpressionIds.length);

      entities.forEach((entity, index) => {
        expect(entity).toBeInstanceOf(UserAdjectiveExpressionEntity);
        expect(entity.userId).toBe(userId);
        expect(entity.adjectiveExpressionId).toBe(
          adjectiveExpressionIds[index],
        );
      });
    });

    it('adjectiveExpressionIds가 빈배열일 경우 빈배열을 반환합니다.', () => {
      const userId = 1;
      const adjectiveExpressionIds: number[] = [];

      const entities = UserAdjectiveExpressionMapper.toEntities(
        userId,
        adjectiveExpressionIds,
      );

      expect(entities).toEqual([]);
    });
  });
});
