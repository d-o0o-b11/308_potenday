import { UserMapper } from '../../../../infrastructure/database/mapper/user.mapper';
import { CreateUserDto } from '../../../../interface';
import { UserEntity } from '../../../../infrastructure/database/entity/user.entity';

describe('UserMapper', () => {
  describe('toEntity', () => {
    it('CreateUserDto를 UserEntity로 반환해야합니다.', () => {
      const createUserDto: CreateUserDto = {
        urlId: 1,
        imgId: 4,
        nickName: 'testUser',
      };

      const entity = UserMapper.toEntity(createUserDto);

      expect(entity).toBeInstanceOf(UserEntity);
      expect(entity.urlId).toBe(createUserDto.urlId);
      expect(entity.imgId).toBe(createUserDto.imgId);
      expect(entity.nickName).toBe(createUserDto.nickName);
    });
  });
});
