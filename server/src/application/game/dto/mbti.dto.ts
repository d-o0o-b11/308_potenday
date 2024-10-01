import { UserMbti } from '@domain';

export class SaveUserMbtiDto {
  constructor(
    public readonly urlId: number,
    public readonly userId: number,
    public readonly mbti: string,
    public readonly toUserId: number,
  ) {}
}

export class CreateUserMbtiDto {
  constructor(
    public readonly userId: number,
    public readonly mbti: string,
    public readonly toUserId: number,
  ) {}
}

export class UserMbtiRawDto {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly mbti: string,
    public readonly toUserId: number,
    public readonly nickName: string,
    public readonly imgId: number,
  ) {}
}

export class UserMbtiSubmitCountDto {
  constructor(
    public readonly submitCount: number,
    public readonly saveResult: UserMbti,
  ) {}
}

export class CreateMbtiReadDto {
  constructor(
    public readonly mbtiId: number,
    public readonly userId: number,
    public readonly mbti: string,
    public readonly toUserId: number,
    public readonly createdAt: Date,
  ) {}
}

export class FindSubmitMbtiUserDto {
  constructor(
    public readonly userId: number,
    public readonly toUserId: number,
  ) {}
}

export class FindUserMbtiDto {
  constructor(
    public readonly urlId: number,
    public readonly toUserId: number,
  ) {}
}

export class DeleteUserMbtiReadDto {
  constructor(
    public readonly mbtiId: number,
    public readonly userId: number,
  ) {}
}
