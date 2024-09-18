import { UserMbtiEntity, UserMbtiMapper } from '@infrastructure';

describe('UserMbtiMapper', () => {
  describe('toEntity', () => {
    it('UserMbtiEntity 인스턴스를 반환합니다.', () => {
      const userId = 1;
      const mbti = 'INTJ';
      const toUserId = 2;

      const entity = UserMbtiMapper.toEntity(userId, mbti, toUserId);

      expect(entity).toBeInstanceOf(UserMbtiEntity);
      expect(entity.userId).toBe(userId);
      expect(entity.mbti).toBe(mbti);
      expect(entity.toUserId).toBe(toUserId);
    });
  });
});
