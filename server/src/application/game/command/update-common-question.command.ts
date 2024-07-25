export class UpdateCommonQuestionCommand {
  constructor(
    public readonly urlId: number,
    public readonly questionId: number,
  ) {}
}
