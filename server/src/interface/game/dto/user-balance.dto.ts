import { BALANCE_TYPES, BalanceType, UserBalance } from '@domain';
import { IsIn, IsNumber, IsNumberString } from 'class-validator';

export class SaveUserBalanceDto {
  /**
   * USER ID
   * @example 12
   */
  @IsNumber()
  userId: number;

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

export class CreateBalanceReadDto {
  constructor(
    public readonly userId: number,
    public readonly balanceId: number,
    public readonly balanceType: BalanceType,
    public readonly createdAt: Date,
  ) {}
}

export class CreateBalanceDto extends SaveUserBalanceDto {
  /**
   * URL ID
   * @example 27
   */
  @IsNumber()
  urlId: number;
}

export class FindSubmitUserDto {
  /**
   * USER ID
   * @example 12
   */
  @IsNumber()
  userId: number;

  /**
   * 밸런스 ID
   * @example 1
   */
  @IsNumber()
  balanceId: number;
}

/**
 * 쿼리 파라미터는 기본적으로 문자열로 전달됩니다.
 * 따라서, @IsNumberString() 데코레이터를 사용하는 것이 좋습니다.
 * @IsNumberString() 데코레이터는 문자열 형태의 숫자를 허용하고,
 * 이를 올바르게 검증합니다.
 */
export class FindUserBalanceDto {
  /**
   * URL ID
   * @example 27
   */
  @IsNumberString()
  urlId: number;

  /**
   * 밸런스 ID
   * @example 1
   */
  @IsNumberString()
  balanceId: number;
}

export class FindBalanceListDto {
  constructor(public readonly balanceId: number) {}
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

export class DeleteUserBalanceReadDto {
  constructor(
    public readonly userId: number,
    public readonly balanceId: number,
  ) {}
}

export class DeleteUserBalanceDto {
  constructor(
    public readonly userId: number,
    public readonly balanceId: number,
  ) {}
}
