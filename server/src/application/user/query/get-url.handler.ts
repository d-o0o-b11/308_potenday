import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUrlQuery } from './get-url.query';
import { Inject, Injectable } from '@nestjs/common';
import { USER_URL_SERVICE_TOKEN } from '@infrastructure';
import { IUserUrlService, SetUrlResponseDto } from '@interface';

@Injectable()
@QueryHandler(GetUrlQuery)
export class GetUrlQueryHandler implements IQueryHandler<GetUrlQuery> {
  constructor(
    @Inject(USER_URL_SERVICE_TOKEN)
    private urlService: IUserUrlService,
  ) {}

  async execute(): Promise<SetUrlResponseDto> {
    const result = await this.urlService.setUrl();

    return {
      id: result.id,
      url: result.url,
    };
  }
}
