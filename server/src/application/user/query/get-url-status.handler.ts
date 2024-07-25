import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { GetUrlStatusQuery } from './get-url-status.query';
import { USER_URL_REPOSITORY_TOKEN } from '@infrastructure';
import { IUserUrlRepository } from '@domain';
import { GetUrlStatusResponseDto } from '@interface';

@Injectable()
@QueryHandler(GetUrlStatusQuery)
export class GetUrlStatusHandler implements IQueryHandler<GetUrlStatusQuery> {
  constructor(
    @Inject(USER_URL_REPOSITORY_TOKEN)
    private userUrlRepository: IUserUrlRepository,
  ) {}

  async execute(query: GetUrlStatusQuery): Promise<GetUrlStatusResponseDto> {
    const { urlId } = query;
    const findResult = await this.userUrlRepository.findOne({ urlId });

    return { status: findResult.getStatus() };
  }
}
