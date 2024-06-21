import { AdjectiveExpression } from '@game/domain';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateUserAdjectiveExpressionDto {
  /**
   * URL
   * @example "12efds"
   */
  @IsString()
  url: string;

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
  expressionIds: number[];
}

export class GroupByUserAdjectiveExpressionDto {
  userId: number;
  nickName: string;
  imgId: number;
  adjectiveExpressions: AdjectiveExpression[];
}
