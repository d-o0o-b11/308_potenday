import { Injectable } from '@nestjs/common';
import { UserBalance } from '../user-balance';
import {
  ReconstituteBalanceArrayDto,
  ReconstituteBalanceDto,
} from '@application';

@Injectable()
export class BalanceFactory {
  reconstituteArray(dto: ReconstituteBalanceArrayDto): UserBalance {
    return new UserBalance(
      dto.id,
      dto.userId,
      dto.balanceType,
      dto.balanceId,
      dto.name,
      dto.imgId,
      dto.balanceGame,
    );
  }

  reconstitute(dto: ReconstituteBalanceDto): UserBalance {
    return new UserBalance(
      dto.id,
      dto.userId,
      dto.balanceType,
      dto.balanceId,
      undefined,
      undefined,
      undefined,
      dto.createdAt,
    );
  }
}
