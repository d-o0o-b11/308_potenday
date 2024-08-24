import { BalanceType } from '@domain';

export class Balance {
  balanceId: number;
  balanceType: BalanceType;
  createdAt: string;
}

export class Mbti {
  mbti: string;
  toUserId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export class AdjectiveExpressionRead {
  adjectiveExpressionIdList: number[];
  createdAt: string;
}

export class UserRead {
  constructor(
    private readonly userId: number,
    private readonly imgId: number,
    private readonly nickname: string,
    private readonly urlId: number,
    private readonly createdAt: Date,
    private readonly updatedAt: Date,
    private readonly deletedAt: Date | null,
    private readonly balance?: Balance[],
    private readonly mbti?: Mbti[],
    private readonly adjectiveExpression?: AdjectiveExpressionRead,
  ) {}

  getUserId(): Readonly<number> {
    return this.userId;
  }

  getImgId(): Readonly<number> {
    return this.imgId;
  }

  getNickname(): Readonly<string> {
    return this.nickname;
  }

  getUrlId(): Readonly<number> {
    return this.urlId;
  }

  getCreatedAt(): Readonly<Date> {
    return this.createdAt;
  }

  getUpdatedAt(): Readonly<Date> {
    return this.updatedAt;
  }

  getDeletedAt(): Readonly<Date | null> {
    return this.deletedAt;
  }

  getBalance(): Readonly<Balance[]> {
    return this.balance;
  }

  getMbti(): Readonly<Mbti[]> {
    return this.mbti;
  }

  getAdjectiveExpressions(): Readonly<AdjectiveExpressionRead> {
    return this.adjectiveExpression;
  }

  //형용사 표현이 존재하면 true, 존재하지 않으면 false
  hasAdjectiveExpressionList(): boolean {
    return !!this.adjectiveExpression;
  }
}
