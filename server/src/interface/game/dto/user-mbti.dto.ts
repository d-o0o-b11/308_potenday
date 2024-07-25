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

export class FindSubmitMbtiDto {
  /**
   * USER ID
   * @example 12
   */
  @IsNumber()
  userId: number;

  /**
   * 대상 사용자 ID
   * @example 11
   */
  @IsNumber()
  toUserId: number;
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

export class SaveUserMbtiDto {
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

export class UserMbtiRawDto {
  userId: number;
  mbti: string;
  nickName: string;
  imgId: number;
  toUserId: number;
}

export class FindUserMbtiDto {
  /**
   * 대상 사용자 ID
   * @example 11
   */
  @IsNumber()
  toUserId: number;
}

export class FindUserMbtiByUrlIdDto {
  /**
   * URL ID
   * @example 1
   */
  @IsNumber()
  urlId: number;
}

export class UserMbtiSubmitCountDto {
  /**
   * mbti 의견 제출한 유저 수
   * @example 2
   */
  @IsNumber()
  submitCount: number;
}
