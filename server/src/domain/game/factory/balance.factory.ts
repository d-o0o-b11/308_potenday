import { Injectable } from '@nestjs/common';
import { UserBalance } from '../user-balance';
import { BalanceType } from '../enums';

@Injectable()
export class BalanceFactory {
  reconstituteArray(
    id: number,
    userId: number,
    nickName: string,
    imgId: number,
    balanceId: number,
    balanceType: BalanceType,
    balanceGame?: { typeA: string; typeB: string },
  ): UserBalance {
    return new UserBalance(
      id,
      userId,
      balanceType,
      balanceId,
      nickName,
      imgId,
      balanceGame,
    );
  }

  reconstitute(
    id: number,
    userId: number,
    balanceId: number,
    balanceType: BalanceType,
    createdAt: Date,
  ): UserBalance {
    return new UserBalance(
      id,
      userId,
      balanceType,
      balanceId,
      undefined,
      undefined,
      undefined,
      createdAt,
    );
  }
}
