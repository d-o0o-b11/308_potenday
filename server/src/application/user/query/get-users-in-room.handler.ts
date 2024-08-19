import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { GetUsersInRoomQuery } from './get-users-in-room.query';
import { URL_REPOSITORY_TOKEN } from '@infrastructure';
import { IUrlRepository, User } from '@domain';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { FindOneUserUrlWithUserDto } from '@interface';

@Injectable()
@QueryHandler(GetUsersInRoomQuery)
export class GetUsersInRoomQueryHandler
  implements IQueryHandler<GetUsersInRoomQuery>
{
  constructor(
    @Inject(URL_REPOSITORY_TOKEN)
    private userUrlRepository: IUrlRepository,
    @InjectEntityManager() private readonly manager: EntityManager,
  ) {}

  async execute(query: GetUsersInRoomQuery): Promise<User> {
    const { urlId, roundId } = query;
    return (
      await this.userUrlRepository.findOneWithUser(
        new FindOneUserUrlWithUserDto(urlId),
        this.manager,
      )
    ).getUserList()[roundId - 1];
  }
}
