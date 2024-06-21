export class CreateUserAdjectiveExpressionCommand {
  constructor(
    public readonly url: string,
    public readonly urlId: number,
    public readonly userId: number,
    public readonly expressionIds: number[],
  ) {}
}
