import { IUserMbtiRepository } from '@domain';
import { USER_MBTI_REPOSITORY_TOKEN } from '@infrastructure';
import { Inject, Injectable } from '@nestjs/common';
import { UserMbtiException } from '@common';
import { IUserMbtiService, SaveUserMbtiDto } from '@interface';

@Injectable()
export class UserMbtiService implements IUserMbtiService {
  constructor(
    @Inject(USER_MBTI_REPOSITORY_TOKEN)
    private readonly userMbtiRepository: IUserMbtiRepository,
  ) {}

  async saveUserMbtiAndGetSubmitCount(dto: SaveUserMbtiDto) {
    if (
      await this.userMbtiRepository.isSubmitUser({
        userId: dto.userId,
        toUserId: dto.toUserId,
      })
    ) {
      throw new UserMbtiException();
    }

    await this.userMbtiRepository.save({
      userId: dto.userId,
      mbti: dto.mbti,
      toUserId: dto.toUserId,
    });

    const submitCount = (
      await this.userMbtiRepository.find({ toUserId: dto.toUserId })
    ).length;

    return { submitCount: submitCount };
  }
}
