import { BALANCE_TYPES, BalanceType } from '@domain';
import { UserBalanceEntity, UserBalanceMapper } from '@infrastructure';

describe('UserBalanceMapper', () => {
  describe('toEntity', () => {
    it('UserBalanceEntity 인스턴스를 반환합니다.', () => {
      const userId = 1;
      const balanceId = 100;
      const balanceType: BalanceType = BALANCE_TYPES.A;

      const entity = UserBalanceMapper.toEntity(userId, balanceId, balanceType);

      expect(entity).toBeInstanceOf(UserBalanceEntity);
      expect(entity.userId).toBe(userId);
      expect(entity.balanceId).toBe(balanceId);
      expect(entity.balanceType).toBe(balanceType);
    });
  });
});
