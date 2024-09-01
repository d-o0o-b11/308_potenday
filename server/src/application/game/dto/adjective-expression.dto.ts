import { AdjectiveExpressionRead } from '@domain';

export class SaveUserAdjectiveExpressionDto {
  constructor(
    public readonly userId: number,
    public readonly expressionIdList: number[],
  ) {}
}

export class CreateUserAdjectiveExpressionReadDto {
  constructor(
    public readonly userId: number,
    public readonly expressionIdList: number[],
    public readonly createdAt: Date,
  ) {}
}

export class FindUserAdjectiveExpressionReadDto {
  constructor(
    public readonly userId: number,
    public readonly imgId: number,
    public readonly nickname: string,
    public readonly urlId: number,
    public readonly adjectiveExpression?: AdjectiveExpressionRead,
  ) {}
}
