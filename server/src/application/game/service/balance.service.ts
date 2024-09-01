import { IBalanceReadRepository, IBalanceRepository } from '@domain';
import {
  BALANCE_READ_REPOSITORY_TOKEN,
  BALANCE_REPOSITORY_TOKEN,
} from '@infrastructure';
import { Inject, Injectable } from '@nestjs/common';
import { SubmitBalanceException } from '@common';
import { CreateBalanceDto, IBalanceService } from '@interface';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Injectable()
export class BalanceService implements IBalanceService {
  constructor(
    @Inject(BALANCE_REPOSITORY_TOKEN)
    private readonly balanceRepository: IBalanceRepository,
    @Inject(BALANCE_READ_REPOSITORY_TOKEN)
    private readonly balanceReadRepository: IBalanceReadRepository,
    @InjectEntityManager('read')
    private readonly readManager: EntityManager,
  ) {}

  async saveUserExpressionAndGetSubmitCount(dto: CreateBalanceDto) {
    if (
      await this.balanceReadRepository.isSubmitUser(
        {
          userId: dto.userId,
          balanceId: dto.balanceId,
        },
        this.readManager,
      )
    ) {
      throw new SubmitBalanceException();
    }

    const saveResult = await this.balanceRepository.create({
      userId: dto.userId,
      balanceId: dto.balanceId,
      balanceType: dto.balanceType,
    });

    const submitCount = (
      await this.balanceReadRepository.findUserCount(
        {
          urlId: dto.urlId,
          balanceId: dto.balanceId,
        },
        this.readManager,
      )
    ).count;

    return { submitCount: submitCount, saveResult };
  }
}
