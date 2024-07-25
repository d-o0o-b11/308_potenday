import { Injectable } from '@nestjs/common';
import { BalanceList } from '../balance-list';

@Injectable()
export class BalanceListFactory {
  reconstitute(id: number, typeA: string, typeB: string): BalanceList {
    return new BalanceList(id, typeA, typeB);
  }
}
