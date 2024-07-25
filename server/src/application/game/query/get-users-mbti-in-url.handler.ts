import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { GetUsersMbtiInUrlQuery } from './get-users-mbti-in-url.query';
import { IUserMbtiRepository, UserMbti } from '@domain';
import { USER_MBTI_REPOSITORY_TOKEN } from '@infrastructure';

@Injectable()
@QueryHandler(GetUsersMbtiInUrlQuery)
export class GetUsersMbtiInUrlQueryHandler
  implements IQueryHandler<GetUsersMbtiInUrlQuery>
{
  constructor(
    @Inject(USER_MBTI_REPOSITORY_TOKEN)
    private userMbtiRepository: IUserMbtiRepository,
  ) {}

  async execute(query: GetUsersMbtiInUrlQuery): Promise<UserMbti[]> {
    return await this.userMbtiRepository.findUserMbtiByUrlId({
      urlId: query.urlId,
    });
  }
}
