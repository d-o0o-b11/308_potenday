import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUrlQuery } from './get-url.query';
import { IUserUrlService } from '../../interface';
import { Inject, Injectable } from '@nestjs/common';
import { USER_URL_SERVICE_TOKEN } from '../../infrastructure';

@Injectable()
@QueryHandler(GetUrlQuery)
export class GetUrlQueryHandler implements IQueryHandler<GetUrlQuery> {
  constructor(
    @Inject(USER_URL_SERVICE_TOKEN)
    private urlService: IUserUrlService,
  ) {}

  async execute(): Promise<{ url: string }> {
    const url = await this.urlService.setUrl();

    return { url: url };
  }
}
