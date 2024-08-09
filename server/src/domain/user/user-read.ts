import { BalanceType } from '@domain';

export class Balance {
  balanceId: number;
  balanceType: BalanceType;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export class Mbti {
  mbti: string;
  toUserId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export class AdjectiveExpressionList {
  adjectiveExpressionId: number[];
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
    private readonly createdAt: Date,
    private readonly updatedAt: Date,
    private readonly deletedAt: Date | null,
    private readonly balance?: Balance[],
    private readonly mbti?: Mbti[],
    private readonly adjectiveExpressionList?: AdjectiveExpressionList,
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

  getAdjectiveExpressions(): Readonly<AdjectiveExpressionList> {
    return this.adjectiveExpressionList;
  }
}
