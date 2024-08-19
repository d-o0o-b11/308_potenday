export class CreateUserAdjectiveExpressionCommand {
  constructor(
    public readonly urlId: number,
    public readonly userId: number,
    public readonly expressionIdList: number[],
  ) {}
}
