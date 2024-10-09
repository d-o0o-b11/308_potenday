import { IsNumber, IsString } from 'class-validator';

export class FindOneUserInfoDto {
  /**
   * userId
   * @example 111
   */
  readonly userId: number;

  /**
   * imgId
   * @example 1
   */
  readonly imgId: number;

  /**
   * name
   * @example d_o0o_b
   */
  readonly name: string;
}

export class CreateUserCommandDto {
  /**
   * URL ID
   * @example 11
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
  readonly name: string;
}
