import { UserUrlMapper } from '@infrastructure';
import { UserUrlEntity } from '@infrastructure/user/database/entity/cud/user-url.entity';

describe('UserUrlMapper', () => {
  describe('toEntity', () => {
    it('url이 UserUrlEntity로 반환되야합니다.', () => {
      const url = 'http://example.com';

      const entity = UserUrlMapper.toEntity(url);

      expect(entity).toBeInstanceOf(UserUrlEntity);
      expect(entity.url).toBe(url);
    });
  });
});
