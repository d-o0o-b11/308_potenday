import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { USER_MBTI_REPOSITORY_TOKEN } from '../../infrastructure';
import { IUserMbtiRepository } from '../../domain';
import { GetUsersMbtiInUrlQuery } from './get-users-mbti-in-url.query';

@Injectable()
@QueryHandler(GetUsersMbtiInUrlQuery)
export class GetUsersMbtiInUrlQueryHandler
  implements IQueryHandler<GetUsersMbtiInUrlQuery>
{
  constructor(
    @Inject(USER_MBTI_REPOSITORY_TOKEN)
    private userMbtiRepository: IUserMbtiRepository,
  ) {}

  async execute(query: GetUsersMbtiInUrlQuery) {
    return await this.userMbtiRepository.findUserMbtiByUrlId(query.urlId);
  }
}
