export class UserBalance {
  constructor(
    private readonly id: number,
    private readonly userId: number,
    private readonly balanceType: string,
    private readonly balanceId: number,
    private readonly nickName?: string,
    private readonly imgId?: number,
    private readonly balanceGame?: { typeA: string; typeB: string },
  ) {}

  getId(): Readonly<number> {
    return this.id;
  }

  getUserId(): Readonly<number> {
    return this.userId;
  }

  getBalanceType(): Readonly<string> {
    return this.balanceType;
  }

  getBalanceId(): Readonly<number> {
    return this.balanceId;
  }

  /**
   * @memo
   * UserBalanceEntity에는 nickName,imgId 컬럼이 없다...
   * 여기에 추가하는게 맞는걸까?
   */
  getNickName(): Readonly<string> {
    return this.nickName;
  }

  getImgId(): Readonly<number> {
    return this.imgId;
  }

  getBalanceGame(): Readonly<{ typeA: string; typeB: string }> {
    return this.balanceGame;
  }
}
