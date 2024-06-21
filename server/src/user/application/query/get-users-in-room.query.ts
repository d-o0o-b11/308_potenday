import { IQuery } from '@nestjs/cqrs';

export class GetUsersInRoomQuery implements IQuery {
  constructor(
    public readonly url: string,
    public readonly roundId: number,
  ) {}
}
