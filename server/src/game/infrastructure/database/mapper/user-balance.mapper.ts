import { UserBalanceEntity } from '../entity';

export class UserBalanceMapper {
  static toEntity(
    userId: number,
    balanceId: number,
    balanceType: string,
  ): UserBalanceEntity {
    const entity = new UserBalanceEntity();
    entity.userId = userId;
    entity.balanceId = balanceId;
    entity.balanceType = balanceType;
    return entity;
  }
}
