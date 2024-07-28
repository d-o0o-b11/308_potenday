import { BalanceType } from '@domain';

class Balance {
  balanceId: number;
  balanceType: BalanceType;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

class Mbti {
  mbti: string;
  toUserId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

class AdjectiveExpression {
  adjectiveExpressionId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export class UserRead {
  constructor(
    private readonly userId: number,
    private readonly imgId: number,
    private readonly nickname: string,
    private readonly urlId: number,
    private readonly createdAt: string,
    private readonly updatedAt: string,
    private readonly deletedAt: string | null,
    private readonly balance: Balance[],
    private readonly mbti: Mbti[],
    private readonly adjectiveExpressionList: AdjectiveExpression[],
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

  getCreatedAt(): Readonly<string> {
    return this.createdAt;
  }

  getUpdatedAt(): Readonly<string> {
    return this.updatedAt;
  }

  getDeletedAt(): Readonly<string | null> {
    return this.deletedAt;
  }

  getBalance(): Readonly<Balance[]> {
    return this.balance;
  }

  getMbti(): Readonly<Mbti[]> {
    return this.mbti;
  }

  getAdjectiveExpressions(): Readonly<AdjectiveExpression[]> {
    return this.adjectiveExpressionList;
  }
}
