export class CreateUserMbtiCommand {
  constructor(
    public readonly url: string,
    public readonly urlId: number,
    public readonly userId: number,
    public readonly mbti: string,
    public readonly toUserId: number,
  ) {}
}
