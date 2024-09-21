import { UserRead } from '@domain';
import { CreateUserDto } from '@application';
import { UserEntity, UserReadEntity } from '../entity';

export class UserMapper {
  static toEntity(dto: CreateUserDto): UserEntity {
    const entity = new UserEntity();
    entity.urlId = dto.urlId;
    entity.imgId = dto.imgId;
    entity.nickName = dto.nickName;
    return entity;
  }

  static toEntityRead(userRead: UserRead): UserReadEntity {
    const entity = new UserReadEntity();
    entity.data = userRead;

    return entity;
  }
}
