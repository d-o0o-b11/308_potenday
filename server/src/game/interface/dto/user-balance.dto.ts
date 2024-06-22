import { BalanceType } from '@game/domain';
import { IsEnum, IsNumber, IsNumberString, IsString } from 'class-validator';

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
  @IsEnum(BalanceType)
  balanceType: BalanceType;
}

export class CreateBalanceDto extends SaveUserBalanceDto {
  /**
   * URL
   * @example '13fdf'
   */
  @IsString()
  url: string;

  /**
   * URL ID
   * @example 27
   */
  @IsNumber()
  urlId: number;
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
  /**
   * 밸런스 ID
   * @example 1
   */
  @IsNumber()
  balanceId: number;
}
