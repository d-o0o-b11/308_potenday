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

export class CreateFactoryUserDto extends CreateUserDto {
  /**
   * USER ID
   * @example 11
   */
  @IsNumber()
  readonly userId: number;
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
  readonly nickName: string;
}

export class ReconstituteArrayUserFactoryDto extends CreateUserDto {
  /**
   * URL ID
   * @example 1
   */
  @IsNumber()
  id: number;
}
