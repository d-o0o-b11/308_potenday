import { ICommand } from '@nestjs/cqrs';

export class CreateUserReadCommand implements ICommand {
  constructor(
    public readonly userId: number,
    public readonly imgId: number,
    public readonly name: string,
    public readonly urlId: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date | null,
    public readonly deletedAt: Date | null,
  ) {}
}
