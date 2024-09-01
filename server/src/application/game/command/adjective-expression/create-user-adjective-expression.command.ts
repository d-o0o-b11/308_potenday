import { ICommand } from '@nestjs/cqrs';

export class CreateUserAdjectiveExpressionCommand implements ICommand {
  constructor(
    public readonly urlId: number,
    public readonly userId: number,
    public readonly expressionIdList: number[],
  ) {}
}
