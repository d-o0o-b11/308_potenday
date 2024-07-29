import { UserMbtiEntity } from '../entity/cud/user-mbti.entity';

export class UserMbtiMapper {
  static toEntity(
    userId: number,
    mbti: string,
    toUserId: number,
  ): UserMbtiEntity {
    const entity = new UserMbtiEntity();
    entity.userId = userId;
    entity.mbti = mbti;
    entity.toUserId = toUserId;
    return entity;
  }
}
