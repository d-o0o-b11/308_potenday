import { IQuery } from '@nestjs/cqrs';

export class GetUserMbtiQuery implements IQuery {
  constructor(public readonly toUserId: number) {}
}
