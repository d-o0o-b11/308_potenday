import { IUserBalanceRepository } from '@domain';
import { USER_BALANCE_REPOSITORY_TOKEN } from '@infrastructure';
import { Inject, Injectable } from '@nestjs/common';
import { UserBalanceException } from '@common';
import { CreateBalanceDto, IUserBalanceService } from '@interface';

@Injectable()
export class UserBalanceService implements IUserBalanceService {
  constructor(
    @Inject(USER_BALANCE_REPOSITORY_TOKEN)
    private readonly userBalanceRepository: IUserBalanceRepository,
  ) {}

  async saveUserExpressionAndGetSubmitCount(dto: CreateBalanceDto) {
    if (
      await this.userBalanceRepository.isSubmitUser({
        userId: dto.userId,
        balanceId: dto.balanceId,
      })
    ) {
      throw new UserBalanceException();
    }

    await this.userBalanceRepository.save({
      userId: dto.userId,
      balanceId: dto.balanceId,
      balanceType: dto.balanceType,
    });

    const submitCount = (
      await this.userBalanceRepository.findUserCount({
        urlId: dto.urlId,
        balanceId: dto.balanceId,
      })
    ).count;

    return { submitCount: submitCount };
  }
}
