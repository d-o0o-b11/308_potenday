import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { GetUsersInRoomQuery } from './get-users-in-room.query';
import { USER_URL_REPOSITORY_TOKEN } from '@infrastructure';
import { IUserUrlRepository, User } from '@domain';

@Injectable()
@QueryHandler(GetUsersInRoomQuery)
export class GetUsersInRoomQueryHandler
  implements IQueryHandler<GetUsersInRoomQuery>
{
  constructor(
    @Inject(USER_URL_REPOSITORY_TOKEN)
    private userUrlRepository: IUserUrlRepository,
  ) {}

  async execute(query: GetUsersInRoomQuery): Promise<User> {
    const { urlId, roundId } = query;
    return (
      await this.userUrlRepository.findOneWithUser({ urlId })
    ).getUserList()[roundId - 1];
  }
}
