import { IsNumber, IsString } from 'class-validator';

export class CreateUserUrlDto {
  /**
   * URL
   * @example 'qervvdd'
   */
  @IsString()
  readonly url: string;
}

export class UpdateUserUrlDto {
  /**
   * URL ID
   * @example 33
   */
  @IsNumber()
  readonly urlId: number;
}

export class FindOneUserUrlDto {
  /**
   * URL
   * @example 'qervvdd'
   */
  @IsString()
  readonly url: string;
}

export class FindOneUserUrlWithUserDto {
  /**
   * URL
   * @example 'qervvdd'
   */
  @IsString()
  readonly url: string;
}

export class FindAdjectiveExpressionListDto {
  /**
   * URL
   * @example 'qervvdd'
   */
  @IsString()
  readonly url: string;
}
