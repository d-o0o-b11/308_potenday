import { ICommand } from '@nestjs/cqrs';

export class GenerateTokenCommand implements ICommand {
  constructor(
    public readonly urlId: number,
    public readonly userId: number,
  ) {}
}
