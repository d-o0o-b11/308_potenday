import { IQuery } from '@nestjs/cqrs';

export class GetUrlStatusQuery implements IQuery {
  constructor(public readonly urlId: number) {}
}
