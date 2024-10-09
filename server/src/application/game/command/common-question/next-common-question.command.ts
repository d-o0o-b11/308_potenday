import { ICommand } from '@nestjs/cqrs';

export class NextCommonQuestionCommand implements ICommand {
  constructor(public readonly urlId: number) {}
}
