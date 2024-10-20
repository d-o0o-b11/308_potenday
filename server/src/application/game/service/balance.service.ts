import { IBalanceReadRepository, IBalanceRepository } from '@domain';
import {
  BALANCE_READ_REPOSITORY_TOKEN,
  BALANCE_REPOSITORY_TOKEN,
} from '@infrastructure';
import { Inject, Injectable } from '@nestjs/common';
import { SubmitBalanceException } from '@common';
import { IBalanceService } from '@interface';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import {
  CreateUserBalanceAndGetSubmitCountDto,
  CreateUserBalanceDto,
  FindBalanceSubmitUserCountDto,
  FindSubmitUserDto,
} from '../dto';

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

  async saveUserExpressionAndGetSubmitCount(
    dto: CreateUserBalanceAndGetSubmitCountDto,
  ) {
    if (
      await this.balanceReadRepository.isSubmitUser(
        new FindSubmitUserDto(dto.userId, dto.balanceId),
        this.readManager,
      )
    ) {
      throw new SubmitBalanceException();
    }

    const saveResult = await this.balanceRepository.create(
      new CreateUserBalanceDto(dto.userId, dto.balanceId, dto.balanceType),
    );

    const submitCount = (
      await this.balanceReadRepository.findUserCount(
        new FindBalanceSubmitUserCountDto(dto.urlId, dto.balanceId),
        this.readManager,
      )
    ).count;

    return { submitCount: submitCount, saveResult };
  }
}
