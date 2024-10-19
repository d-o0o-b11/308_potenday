import { IsNumber, IsString } from 'class-validator';

export class SaveMbtiDto {
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
