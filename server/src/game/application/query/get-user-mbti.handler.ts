import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { USER_MBTI_REPOSITORY_TOKEN } from '../../infrastructure';
import { IUserMbtiRepository } from '../../domain';
import { GetUserMbtiQuery } from './get-user-mbti.query';
import { FindUserMbtiAnswerResponseDto } from '../../interface';

@Injectable()
@QueryHandler(GetUserMbtiQuery)
export class GetUserMbtiQueryHandler
  implements IQueryHandler<GetUserMbtiQuery>
{
  constructor(
    @Inject(USER_MBTI_REPOSITORY_TOKEN)
    private userMbtiRepository: IUserMbtiRepository,
  ) {}

  async execute(
    query: GetUserMbtiQuery,
  ): Promise<FindUserMbtiAnswerResponseDto> {
    return await this.userMbtiRepository.findUserMbtiAnswer({
      toUserId: query.toUserId,
    });
  }
}
