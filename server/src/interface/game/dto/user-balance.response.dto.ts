import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';

export class FindUserCountResponseDto {
  /**
   * 밸런스 게임 답변한 인원 수
   * @example 2
   */
  count: number;
}

class UserDto {
  /**
   * USER ID
   * @example 12
   */
  @IsNumber()
  id: number;

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
}

class BalanceTypeGroupDto {
  /**
   * 선택한 밸런스 타입
   * @example '피 땀 눈물 흘려 완성한 제안서 저장 전 컴퓨터 꺼져서 날리기(복구 안됨)'
   */
  @IsString()
  balanceType: string;

  /**
   * 선택한 밸런스 타입 USER 정보
   */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserDto)
  users: UserDto[];

  /**
   * 해당 밸런스 타입 선택한 인원 수
   * @example 2
   */
  @IsNumber()
  count: number;
}

export class GroupedByBalanceTypeDto {
  [key: string]: BalanceTypeGroupDto;
}

export class FindUserBalanceResponseDto {
  /**
   * 밸런스 게임 답변한 인원 수
   * @example 2
   */
  @IsNumber()
  totalUsers: number;

  /**
   * 밸런스 게임 결과
   */
  @ValidateNested()
  @Type(() => GroupedByBalanceTypeDto)
  groupedByBalanceType: GroupedByBalanceTypeDto;
}

export class CalculatePercentagesResponseDto {
  /**
   * 선택한 밸런스 타입
   * @example '피 땀 눈물 흘려 완성한 제안서 저장 전 컴퓨터 꺼져서 날리기(복구 안됨)'
   */
  @IsString()
  balanceType: string;

  /**
   * 선택한 밸런스 타입 USER 정보
   */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserDto)
  users: UserDto[];

  /**
   * 해당 밸런스 퍼센트
   * @example '50%'
   */
  @IsString()
  percent: string;
}
