import { IQuery } from '@nestjs/cqrs';

export class GetUsersMbtiInUrlQuery implements IQuery {
  constructor(public readonly urlId: number) {}
}
