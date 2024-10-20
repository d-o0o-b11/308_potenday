import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetUsersInRoomQuery } from './get-users-in-room.query';
import { URL_SERVICE_TOKEN } from '@infrastructure';
import { FindOneUserInfoDto, IUrlService } from '@interface';

@QueryHandler(GetUsersInRoomQuery)
export class GetUsersInRoomQueryHandler
  implements IQueryHandler<GetUsersInRoomQuery>
{
  constructor(
    @Inject(URL_SERVICE_TOKEN) private readonly urlService: IUrlService,
  ) {}

  async execute(query: GetUsersInRoomQuery): Promise<FindOneUserInfoDto> {
    const { urlId, roundId } = query;

    const userList = await this.urlService.getUserInfoInUrl(urlId);

    const user = userList[roundId - 1];

    return {
      userId: user.getUserId(),
      imgId: user.getImgId(),
      name: user.getName(),
    };
  }
}
