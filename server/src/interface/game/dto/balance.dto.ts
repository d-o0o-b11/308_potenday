import { UserBalance } from '@domain';
import { IsIn, IsNumber } from 'class-validator';
import { BALANCE_TYPES, BalanceType } from '@domain';

export class CreateBalanceDto {
  /**
   * 밸런스 ID
   * @example 1
   */
  @IsNumber()
  balanceId: number;

  /**
   * 밸런스 타입(A|B)
   * @example A
   */
  // @IsString()
  @IsIn(Object.values(BALANCE_TYPES))
  balanceType: BalanceType;
}

export class UserBalanceSubmitCountDto {
  /**
   * 밸런스 의견 제출한 유저 수
   * @example 2
   */
  @IsNumber()
  submitCount: number;

  /**
   * 형용사 표현 저장 반환값
   */
  saveResult: UserBalance;
}
