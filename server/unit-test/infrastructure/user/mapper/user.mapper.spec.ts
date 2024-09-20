import { CreateUserDto } from '@application';
import { UserRead } from '@domain';
import { UserEntity, UserMapper, UserReadEntity } from '@infrastructure';

describe('UserMapper', () => {
  describe('toEntity', () => {
    it('UserEntity 인스턴스를 반환합니다.', () => {
      const dto: CreateUserDto = {
        urlId: 1,
        imgId: 101,
        nickName: 'TestUser',
      };

      const entity = UserMapper.toEntity(dto);

      expect(entity).toBeInstanceOf(UserEntity);
      expect(entity.urlId).toBe(dto.urlId);
      expect(entity.imgId).toBe(dto.imgId);
      expect(entity.nickName).toBe(dto.nickName);
    });
  });

  describe('toEntityRead', () => {
    it('UserReadEntity 인스턴스를 반환합니다.', () => {
      const userRead: UserRead = {
        userId: 1,
        urlId: 1,
        imgId: 101,
        nickname: 'd_o0o_b',
        createdAt: new Date(),
      } as any;

      const entity = UserMapper.toEntityRead(userRead);

      expect(entity).toBeInstanceOf(UserReadEntity);
      expect(entity.data).toEqual(userRead);
    });
  });
});
