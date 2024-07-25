import { IQuery } from '@nestjs/cqrs';

export class GetUsersAdjectiveExpressionQuery implements IQuery {
  constructor(public readonly urlId: number) {}
}
