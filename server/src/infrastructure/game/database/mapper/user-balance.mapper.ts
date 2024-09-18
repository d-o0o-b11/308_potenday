import { BalanceType } from '@domain';
import { UserBalanceEntity } from '../entity';
// import { UserBalanceEntity } from '../entity/cud/user-balance.entity';

export class UserBalanceMapper {
  static toEntity(
    userId: number,
    balanceId: number,
    balanceType: BalanceType,
  ): UserBalanceEntity {
    const entity = new UserBalanceEntity();
    entity.userId = userId;
    entity.balanceId = balanceId;
    entity.balanceType = balanceType;
    return entity;
  }
}
