import { Injectable } from '@nestjs/common';
import { BalanceList } from '../balance-list';
import { ReconstituteBalanceListDto } from '@application';

@Injectable()
export class BalanceListFactory {
  reconstitute(dto: ReconstituteBalanceListDto): BalanceList {
    return new BalanceList(dto.id, dto.typeA, dto.typeB);
  }
}
