import { Adjective, AdjectiveExpressionRead } from '@domain';

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
    public readonly name: string,
    public readonly urlId: number,
    public readonly adjectiveExpression?: AdjectiveExpressionRead,
  ) {}
}

export class ReconstituteAdjectiveExpressionArrayDto {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly adjectiveExpressionId: number,
    public readonly createdAt: Date,
  ) {}
}

export class ReconstituteAdjectiveExpressionDto {
  constructor(
    public readonly id: number,
    public readonly adjective: Adjective,
  ) {}
}
