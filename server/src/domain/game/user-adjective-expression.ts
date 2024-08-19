export class UserAdjectiveExpression {
  constructor(
    private readonly id: number,
    private readonly userId: number,
    private readonly adjectiveExpressionId?: number,
    private readonly createdAt?: Date,
  ) {}

  getId(): Readonly<number> {
    return this.id;
  }

  getUserId(): Readonly<number> {
    return this.userId;
  }

  getAdjectiveExpressionId(): Readonly<number> {
    return this.adjectiveExpressionId;
  }

  getCreatedAt(): Readonly<Date> {
    return this.createdAt;
  }
}
