import { AdjectiveExpressionRead } from '@domain';
import { IsArray, IsNumber } from 'class-validator';

export class CreateUserAdjectiveExpressionDto {
  /**
   * URL ID
   * @example 1
   */
  @IsNumber()
  urlId: number;

  /**
   * USER ID
   * @example 12
   */
  @IsNumber()
  userId: number;

  /**
   * 형용사 ID
   * @example [1,3,11]
   */
  @IsArray()
  expressionIdList: number[];
}

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

export class FindUserAdjectiveExpressionDto {
  /**
   * URL ID
   * @example 1
   */
  @IsNumber()
  urlId: number;
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
