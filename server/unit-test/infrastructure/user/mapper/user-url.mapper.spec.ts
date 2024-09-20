import { UrlRead } from '@domain';
import { UrlReadEntity, UserUrlEntity, UserUrlMapper } from '@infrastructure';

describe('UserUrlMapper', () => {
  describe('toEntity', () => {
    it('UserUrlEntity 인스턴스를 반환합니다.', () => {
      const url = 'https://naver.com';

      const entity = UserUrlMapper.toEntity(url);

      expect(entity).toBeInstanceOf(UserUrlEntity);
      expect(entity.url).toBe(url);
    });
  });

  describe('toEntityRead', () => {
    it('UrlReadEntity 인스턴스를 반환합니다.', () => {
      const urlRead: UrlRead = {
        urlId: 123,
        url: 'https://naver.com',
        status: true,
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
      } as any;

      const entity = UserUrlMapper.toEntityRead(urlRead);

      expect(entity).toBeInstanceOf(UrlReadEntity);
      expect(entity.data).toEqual(urlRead);
    });
  });
});
