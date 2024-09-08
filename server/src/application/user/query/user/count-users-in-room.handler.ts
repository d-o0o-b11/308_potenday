import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CountUsersInRoomQuery } from './count-users-in-room.query';
import { URL_SERVICE_TOKEN } from '@infrastructure';
import { CountUsersInRoomDto, IUrlService } from '@interface';
import { FindOneUserUrlDto } from '@application';

@QueryHandler(CountUsersInRoomQuery)
export class CountUsersInRoomQueryHandler
  implements IQueryHandler<CountUsersInRoomQuery>
{
  constructor(
    @Inject(URL_SERVICE_TOKEN)
    private readonly urlService: IUrlService,
  ) {}

  async execute(query: CountUsersInRoomQuery): Promise<CountUsersInRoomDto> {
    const { urlId } = query;
    return await this.urlService.checkUserLimitForUrl(
      new FindOneUserUrlDto(urlId),
    );
  }
}
