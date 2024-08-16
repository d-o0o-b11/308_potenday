import { Type } from 'class-transformer';
import { User } from '@domain';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateUserUrlDto {
  constructor(public readonly url: string) {}
}

export class UpdateUserUrlDto {
  constructor(
    public readonly urlId: number,
    public readonly status: boolean,
  ) {}
}

export class FindOneUserUrlDto {
  constructor(public readonly urlId: number) {}
}

export class FindOneUserWithUrlDto {
  constructor(public readonly url: string) {}
}

export class FindOneUserUrlWithUserDto {
  /**
   * URL
   * @example 11
   */
  @IsNumber()
  readonly urlId: number;
}

export class UpdateUserUrlFactoryDto {
  /**
   * URL ID
   * @example 11
   */
  @IsNumber()
  readonly urlId: number;

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

  @IsString()
  @IsOptional()
  readonly createdAt?: Date;

  @IsString()
  @IsOptional()
  readonly updatedAt?: Date;

  @IsString()
  @IsOptional()
  readonly deletedAt?: Date;
}

export class ReconstituteWithUserFactoryDto extends ReconstituteFactoryDto {
  @IsArray()
  @ValidateNested({ each: true }) // 배열 요소를 각각 유효성 검사
  @Type(() => User) // 배열 요소의 클래스 타입 지정
  users: User[];
}

//------

export class ReconstituteFindFactoryDto {
  constructor(
    public readonly urlId: number,
    public readonly url: string,
    public readonly status: boolean,
    public readonly userIdList: number[] | null,
  ) {}
}

export class CreateUserUrlReadDto {
  constructor(
    public readonly urlId: number,
    public readonly url: string,
    public readonly status: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null,
  ) {}
}

export class UpdateUserUrlStatusDto {
  constructor(public readonly status: boolean) {}
}

export class FindOneByUrlIdDto {
  constructor(public readonly urlId: number) {}
}
