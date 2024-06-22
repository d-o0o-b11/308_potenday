import { Type } from 'class-transformer';
import { User } from '../../domain';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

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

export class UpdateUserUrlFactoryDto {
  /**
   * URL
   * @example 'qervvdd'
   */
  @IsString()
  readonly url: string;

  /**
   * URL 입장여부
   * @example true
   */
  @IsBoolean()
  readonly status: boolean;
}

export class ReconstituteFactoryDto {
  /**
   * URL ID
   * @example 1
   */
  @IsNumber()
  readonly id: number;

  /**
   * URL
   * @example 'qervvdd'
   */
  @IsString()
  readonly url: string;

  /**
   * URL 입장여부
   * @example true
   */
  @IsBoolean()
  readonly status: boolean;
}

export class ReconstituteWithUserFactoryDto extends ReconstituteFactoryDto {
  @IsArray()
  @ValidateNested({ each: true }) // 배열 요소를 각각 유효성 검사
  @Type(() => User) // 배열 요소의 클래스 타입 지정
  users: User[];
}
