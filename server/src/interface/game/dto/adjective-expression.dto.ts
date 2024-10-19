import { IsArray, IsNumber } from 'class-validator';

export class CreateUserAdjectiveExpressionDto {
  /**
   * 형용사 ID
   * @example [1,3,11]
   */
  @IsArray()
  @IsNumber({}, { each: true })
  //첫 번째 {}는 @IsNumber의 기본 옵션 (ex. 숫자 범위나 허용되는 형식)
  //두 번째 { each: true }는 배열의 각 요소에 대해 숫자인지 검증
  expressionIdList: number[];
}
