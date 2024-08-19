import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { AdjectiveExpression, UserAdjectiveExpression } from '@domain';
import { Type } from 'class-transformer';

export class GroupByUserAdjectiveExpressionDto {
  /**
   * USER ID
   * @example 1
   */
  @IsNumber()
  userId: number;

  /**
   * USER 닉네임
   * @example 'd_o0o_b'
   */
  @IsString()
  nickName: string;

  /**
   * USER 이미지 ID
   * @example 2
   */
  @IsNumber()
  imgId: number;

  /**
   * 형용사 표현
   */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdjectiveExpression)
  adjectiveExpressionList: AdjectiveExpression[];
}

export class UserAdjectiveExpressionSubmitCountDto {
  saveResult: UserAdjectiveExpression[];
  /**
   * 형용사 표현 제출한 유저 수
   * @example 2
   */
  @IsNumber()
  submitCount: number;
}
