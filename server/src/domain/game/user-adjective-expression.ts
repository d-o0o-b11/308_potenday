import { Adjective } from './enums';

export class UserAdjectiveExpression {
  constructor(
    private readonly id: number,
    private readonly userId: number,
    private readonly adjectiveExpression: Adjective,
    private readonly nickName?: string,
    private readonly imgId?: number,
  ) {}

  getId(): Readonly<number> {
    return this.id;
  }

  getUserId(): Readonly<number> {
    return this.userId;
  }

  getadjectiveExpression(): Readonly<Adjective> {
    return this.adjectiveExpression;
  }

  /**
   * @memo
   * UserAdjectiveExpressionEntity에는 nickName,imgId 컬럼이 없다...
   * 여기에 추가하는게 맞는걸까?
   */
  getNickName(): Readonly<string> {
    return this.nickName;
  }

  getImgId(): Readonly<number> {
    return this.imgId;
  }
}
