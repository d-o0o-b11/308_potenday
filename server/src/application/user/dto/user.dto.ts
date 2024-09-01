import { AdjectiveExpressionRead, Balance, Mbti } from '@domain';

export class CreateUserDto {
  constructor(
    public readonly urlId: number,
    public readonly imgId: number,
    public readonly nickName: string,
  ) {}
}

export class CreateFactoryUserDto extends CreateUserDto {
  constructor(
    urlId: number,
    imgId: number,
    nickName: string,
    public readonly userId: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null,
  ) {
    super(urlId, imgId, nickName);
  }
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
