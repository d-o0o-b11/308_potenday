import { IQuery } from '@nestjs/cqrs';

export class GetUsersInRoomQuery implements IQuery {
  constructor(
    public readonly urlId: number,
    public readonly roundId: number,
  ) {}
}
