import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CountUsersInRoomQuery } from './count-users-in-room.query';
import { URL_SERVICE_TOKEN } from '@infrastructure';
import { CountUserListInRoomResponseDto, IUrlService } from '@interface';
import { FindOneUserUrlDto } from '@application';

@QueryHandler(CountUsersInRoomQuery)
export class CountUsersInRoomQueryHandler
  implements IQueryHandler<CountUsersInRoomQuery>
{
  constructor(
    @Inject(URL_SERVICE_TOKEN)
    private readonly urlService: IUrlService,
  ) {}

  async execute(
    query: CountUsersInRoomQuery,
  ): Promise<CountUserListInRoomResponseDto> {
    const { urlId } = query;

    const countUserList = await this.urlService.checkUserLimitForUrl(
      new FindOneUserUrlDto(urlId),
    );

    const userInfo = countUserList.userInfo.map((element) => ({
      id: element.getUserId(),
      imgId: element.getImgId(),
      name: element.getName(),
    }));

    return {
      userCount: countUserList.userCount,
      userInfo,
    };
  }
}
