import { IMbtiRepository } from '@domain';
import {
  MBTI_REPOSITORY_READ_TOKEN,
  MBTI_REPOSITORY_TOKEN,
  MbtiReadRepository,
} from '@infrastructure';
import { Inject, Injectable } from '@nestjs/common';
import { SubmitMbtiException } from '@common';
import { IMbtiService } from '@interface';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import {
  CreateUserMbtiDto,
  FindSubmitMbtiUserDto,
  FindUserMbtiDto,
  SaveUserMbtiDto,
} from '../dto';

@Injectable()
export class MbtiService implements IMbtiService {
  constructor(
    @Inject(MBTI_REPOSITORY_TOKEN)
    private readonly mbtiRepository: IMbtiRepository,
    @Inject(MBTI_REPOSITORY_READ_TOKEN)
    private readonly mbtiReadRepository: MbtiReadRepository,
    @InjectEntityManager('read')
    private readonly readManager: EntityManager,
  ) {}

  async saveUserMbtiAndGetSubmitCount(dto: SaveUserMbtiDto) {
    if (
      await this.mbtiReadRepository.isSubmitUser(
        new FindSubmitMbtiUserDto(dto.userId, dto.toUserId),
        this.readManager,
      )
    ) {
      throw new SubmitMbtiException();
    }

    const saveResult = await this.mbtiRepository.create(
      new CreateUserMbtiDto(dto.userId, dto.mbti, dto.toUserId),
    );

    const submitCount = (
      await this.mbtiReadRepository.findUserCount(
        new FindUserMbtiDto(dto.urlId, dto.toUserId),
        this.readManager,
      )
    ).count;

    return { submitCount: submitCount, saveResult };
  }
}
