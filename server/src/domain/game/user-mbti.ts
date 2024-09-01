export class UserMbti {
  constructor(
    private readonly id: number,
    private readonly userId: number,
    private readonly mbti: string,
    private readonly toUserId: number,
    private readonly nickName: string,
    private readonly imgId: number,
    private readonly createdAt?: Date,
  ) {}

  getId(): Readonly<number> {
    return this.id;
  }

  getUserId(): Readonly<number> {
    return this.userId;
  }

  getMbti(): Readonly<string> {
    return this.mbti;
  }

  getToUserId(): Readonly<number> {
    return this.toUserId;
  }

  getNickName(): Readonly<string> {
    return this.nickName;
  }

  getImgId(): Readonly<number> {
    return this.imgId;
  }

  getCreatedAt(): Readonly<Date> {
    return this.createdAt;
  }
}
