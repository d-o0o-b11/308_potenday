import { CreateUserDto, InsertMbtiDto } from '../../../interface';
import { UserEntity } from '../entity';

export class UserMapper {
  static toEntity(dto: CreateUserDto): UserEntity {
    const entity = new UserEntity();
    entity.urlId = dto.urlId;
    entity.imgId = dto.imgId;
    entity.nickName = dto.nickName;
    return entity;
  }

  static toMbtiEntity(dto: InsertMbtiDto): Partial<UserEntity> {
    return {
      id: dto.userId,
      mbti: dto.mbti,
    };
  }
}
