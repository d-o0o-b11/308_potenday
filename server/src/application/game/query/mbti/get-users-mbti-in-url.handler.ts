import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetUsersMbtiInUrlQuery } from './get-users-mbti-in-url.query';
import { MBTI_REPOSITORY_READ_TOKEN } from '@infrastructure';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { UserMbtiAnswer } from '@interface';
import { IMbtiReadRepository } from '@domain';

@QueryHandler(GetUsersMbtiInUrlQuery)
export class GetUsersMbtiInUrlQueryHandler
  implements IQueryHandler<GetUsersMbtiInUrlQuery>
{
  constructor(
    @Inject(MBTI_REPOSITORY_READ_TOKEN)
    private readonly mbtiReadRepository: IMbtiReadRepository,

    @InjectEntityManager('read') private readonly readManager: EntityManager,
  ) {}

  async execute(query: GetUsersMbtiInUrlQuery): Promise<UserMbtiAnswer[]> {
    const findMbtiList = await this.mbtiReadRepository.find(
      query.urlId,
      this.readManager,
    );

    const result = findMbtiList.map((user) => {
      return {
        userId: user.getUserId(),
        nickName: user.getNickName(),
        imgId: user.getImgId(),
        mbti: user.getMbti(),
      };
    });

    return result;
  }
}
