import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CountUsersInRoomQuery } from './count-users-in-room.query';
import { USER_URL_SERVICE_TOKEN } from '@infrastructure';
import { CountUsersInRoomDto, IUrlService } from '@interface';
import { FindOneUserUrlDto } from '@application';

@QueryHandler(CountUsersInRoomQuery)
export class CountUsersInRoomQueryHandler
  implements IQueryHandler<CountUsersInRoomQuery>
{
  constructor(
    @Inject(USER_URL_SERVICE_TOKEN)
    private urlService: IUrlService,
  ) {}

  async execute(query: CountUsersInRoomQuery): Promise<CountUsersInRoomDto> {
    const { urlId } = query;
    return await this.urlService.checkUserLimitForUrl(
      new FindOneUserUrlDto(urlId),
    );
  }
}
