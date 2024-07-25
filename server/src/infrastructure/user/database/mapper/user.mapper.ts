import { CreateUserDto } from '@interface';
import { UserEntity } from '../entity/user.entity';

export class UserMapper {
  static toEntity(dto: CreateUserDto): UserEntity {
    const entity = new UserEntity();
    entity.urlId = dto.urlId;
    entity.imgId = dto.imgId;
    entity.nickName = dto.nickName;
    return entity;
  }
}
