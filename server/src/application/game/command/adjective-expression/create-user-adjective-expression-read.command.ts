import { ICommand } from '@nestjs/cqrs';

export class CreateUserExpressionReadCommand implements ICommand {
  constructor(
    public readonly userId: number,
    public readonly adjectiveExpressionIdList: number[],
    public readonly createdAt: Date,
  ) {}
}
