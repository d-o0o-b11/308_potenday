import { Injectable } from '@nestjs/common';
import { UserBalance } from '../user-balance';

@Injectable()
export class UserBalanceFactory {
  reconstituteArray(
    id: number,
    userId: number,
    nickName: string,
    imgId: number,
    balanceId: number,
    balanceType: string,
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
}
