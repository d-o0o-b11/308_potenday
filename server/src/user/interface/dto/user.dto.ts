import { IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  /**
   * URL ID
   * @example 30
   */
  @IsNumber()
  readonly urlId: number;

  /**
   * 이미지 ID
   * @example 2
   */
  @IsNumber()
  readonly imgId: number;

  /**
   * 닉네임
   * @example 'd_o0o_b'
   */
  @IsString()
  readonly nickName: string;
}

export class CreateUserCommandDto {
  /**
   * URL
   * @example dffga
   */
  @IsString()
  readonly url: string;

  /**
   * 이미지 ID
   * @example 2
   */
  @IsNumber()
  readonly imgId: number;

  /**
   * 닉네임
   * @example 'd_o0o_b'
   */
  @IsString()
  readonly nickName: string;
}

export class InsertMbtiDto {
  /**
   * 유저 ID
   * @example 25
   */
  @IsNumber()
  readonly userId: number;

  /**
   * MBTI
   * @example 'ISTJ'
   */
  @IsString()
  readonly mbti: string;
}

export class UpdateOnboardingDto {
  /**
   * 유저 ID
   * @example 25
   */
  @IsNumber()
  readonly userId: number;
}

export class FindOneUserDto {
  /**
   * 유저 ID
   * @example 25
   */
  @IsNumber()
  readonly userId: number;
}
