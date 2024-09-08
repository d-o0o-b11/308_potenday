import { ICommand } from '@nestjs/cqrs';

export class CreateUrlReadCommand implements ICommand {
  constructor(
    public readonly urlId: number,
    public readonly url: string,
    public readonly status: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date | null,
    public readonly deletedAt: Date | null,
  ) {}
}
