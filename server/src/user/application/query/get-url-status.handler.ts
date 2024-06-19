import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { GetUrlStatusQuery } from './get-url-status.query';
import { IUserUrlRepository } from '../../domain';
import { USER_URL_REPOSITORY_TOKEN } from '../../infrastructure';

@Injectable()
@QueryHandler(GetUrlStatusQuery)
export class GetUrlStatusHandler implements IQueryHandler<GetUrlStatusQuery> {
  constructor(
    @Inject(USER_URL_REPOSITORY_TOKEN)
    private userUrlRepository: IUserUrlRepository,
  ) {}

  async execute(query: GetUrlStatusQuery): Promise<{ status: boolean }> {
    const { url } = query;
    const findResult = await this.userUrlRepository.findOne({ url });

    return { status: findResult.getStatus() };
  }
}
