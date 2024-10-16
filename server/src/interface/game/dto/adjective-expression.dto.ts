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
