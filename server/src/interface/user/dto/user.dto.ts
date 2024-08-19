import { AdjectiveExpressionRead, Balance, Mbti } from '@domain';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  constructor(
    public readonly urlId: number,
    public readonly imgId: number,
    public readonly nickName: string,
  ) {}
}

export class CreateFactoryUserDto extends CreateUserDto {
  /**
   * USER ID
   * @example 11
   */
  @IsNumber()
  readonly userId: number;

  @IsDate()
  readonly createdAt: Date;

  @IsDate()
  readonly updatedAt: Date;

  @IsDate()
  readonly deletedAt: Date | null;
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

export class CreateUserReadDto {
  constructor(
    public readonly userId: number,
    public readonly imgId: number,
    public readonly nickname: string,
    public readonly urlId: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null,
    public readonly balance?: Balance[],
    public readonly mbti?: Mbti[],
    public readonly adjectiveExpression?: AdjectiveExpressionRead,
  ) {}
}
