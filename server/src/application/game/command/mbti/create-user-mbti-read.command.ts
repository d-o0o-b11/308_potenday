import { ICommand } from '@nestjs/cqrs';

export class CreateUserMbtiReadCommand implements ICommand {
  constructor(
    public readonly userId: number,
    public readonly mbti: string,
    public readonly toUserId: number,
    public readonly mbtiId: number,
    public readonly createdAt: Date,
  ) {}
}
