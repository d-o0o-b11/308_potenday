import { ICommand } from '@nestjs/cqrs';

export class CreateUserMbtiCommand implements ICommand {
  constructor(
    public readonly urlId: number,
    public readonly userId: number,
    public readonly mbti: string,
    public readonly toUserId: number,
  ) {}
}
