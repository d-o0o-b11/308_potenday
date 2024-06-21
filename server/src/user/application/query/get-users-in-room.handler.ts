import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { USER_URL_REPOSITORY_TOKEN } from '../../infrastructure';
import { GetUsersInRoomQuery } from './get-users-in-room.query';
import { IUserUrlRepository, User } from '../../domain';

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
    const { url, roundId } = query;
    return (
      await this.userUrlRepository.findOneWithUser({ url })
    ).getUserList()[roundId - 1];
  }
}
