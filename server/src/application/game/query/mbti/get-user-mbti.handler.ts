import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetUserMbtiQuery } from './get-user-mbti.query';
import { MBTI_REPOSITORY_READ_TOKEN } from '@infrastructure';
import { FindUserMbtiAnswerResponseDto } from '@interface';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { FindUserMbtiDto } from '@application';
import { IMbtiReadRepository } from '@domain';

@QueryHandler(GetUserMbtiQuery)
export class GetUserMbtiQueryHandler
  implements IQueryHandler<GetUserMbtiQuery>
{
  constructor(
    @Inject(MBTI_REPOSITORY_READ_TOKEN)
    private readonly mbtiReadRepository: IMbtiReadRepository,

    @InjectEntityManager('read') private readonly readManager: EntityManager,
  ) {}

  async execute(
    query: GetUserMbtiQuery,
  ): Promise<FindUserMbtiAnswerResponseDto> {
    const findMbtiList = await this.mbtiReadRepository.findSubmitList(
      new FindUserMbtiDto(query.urlId, query.toUserId),
      this.readManager,
    );

    const result: FindUserMbtiAnswerResponseDto = {
      answerUser: undefined,
      guessingUsers: [],
    };

    findMbtiList.forEach((user) => {
      const userInfo = {
        userId: user.getUserId(),
        mbti: user.getMbti(),
        nickName: user.getNickName(),
        imgId: user.getImgId(),
      };

      if (user.getUserId() === user.getToUserId()) {
        result.answerUser = userInfo;
      } else {
        result.guessingUsers.push(userInfo);
      }
    });

    return result;
  }
}
