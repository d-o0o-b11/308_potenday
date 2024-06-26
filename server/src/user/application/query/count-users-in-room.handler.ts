import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CountUsersInRoomResponseDto, IUserUrlService } from '../../interface';
import { Inject, Injectable } from '@nestjs/common';
import { CountUsersInRoomQuery } from './count-users-in-room.query';
import { USER_URL_SERVICE_TOKEN } from '../../infrastructure';

@Injectable()
@QueryHandler(CountUsersInRoomQuery)
export class CountUsersInRoomQueryHandler
  implements IQueryHandler<CountUsersInRoomQuery>
{
  constructor(
    @Inject(USER_URL_SERVICE_TOKEN)
    private urlService: IUserUrlService,
  ) {}

  async execute(
    query: CountUsersInRoomQuery,
  ): Promise<CountUsersInRoomResponseDto> {
    const { urlId } = query;
    return await this.urlService.countUsersInRoom(urlId);
  }
}
