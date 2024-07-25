import { IQuery } from '@nestjs/cqrs';

export class CountUsersInRoomQuery implements IQuery {
  constructor(public readonly urlId: number) {}
}
