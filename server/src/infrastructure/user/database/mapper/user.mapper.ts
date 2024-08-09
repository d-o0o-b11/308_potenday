import { CreateUserDto } from '@interface';
import { UserEntity } from '../entity/cud/user.entity';
import { UserRead } from '@domain';
import { UserReadEntity } from '../entity/read/user-read.entity';

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
