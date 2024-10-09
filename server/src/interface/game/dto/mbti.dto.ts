import { IsNumber, IsNumberString, IsString } from 'class-validator';

export class FindMbtiRoundDto {
  /**
   * URL ID
   * @example 11
   */
  @IsNumberString()
  urlId: number;

  /**
   * MBTI 추측 라운드 ID
   * @example 1
   */
  @IsNumberString()
  roundId: number;
}

export class SaveMbtiDto {
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
   * MBTI
   * @example 'ISTJ'
   */
  @IsString()
  mbti: string;

  /**
   * 대상 사용자 ID
   * @example 11
   */
  @IsNumber()
  toUserId: number;
}
