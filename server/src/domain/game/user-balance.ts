import { BalanceType } from './enums';

export class UserBalance {
  constructor(
    private readonly id: number,
    private readonly userId: number,
    private readonly balanceType: BalanceType,
    private readonly balanceId: number,
    private readonly name?: string,
    private readonly imgId?: number,
    private readonly balanceGame?: { typeA: string; typeB: string },
    private readonly createdAt?: Date,
  ) {}

  getId(): Readonly<number> {
    return this.id;
  }

  getUserId(): Readonly<number> {
    return this.userId;
  }

  getBalanceType(): Readonly<BalanceType> {
    return this.balanceType;
  }

  getBalanceId(): Readonly<number> {
    return this.balanceId;
  }

  /**
   * @memo
   * UserBalanceEntity에는 name,imgId 컬럼이 없다...
   * 여기에 추가하는게 맞는걸까?
   */
  getName(): Readonly<string> {
    return this.name;
  }

  getImgId(): Readonly<number> {
    return this.imgId;
  }

  getBalanceGame(): Readonly<{ typeA: string; typeB: string }> {
    return this.balanceGame;
  }

  getCreatedAt(): Readonly<Date> {
    return this.createdAt;
  }
}
