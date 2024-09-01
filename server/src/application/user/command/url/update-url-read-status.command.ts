import { ICommand } from '@nestjs/cqrs';

export class UpdateUrlReadStatusCommand implements ICommand {
  constructor(
    public readonly urlId: number,
    public readonly status: boolean,
  ) {}
}
