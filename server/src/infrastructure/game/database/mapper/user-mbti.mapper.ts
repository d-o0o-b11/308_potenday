import { UserMbtiEntity } from '../entity';

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
