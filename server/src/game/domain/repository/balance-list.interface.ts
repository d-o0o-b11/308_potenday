import { BalanceList } from '../balance-list';

export interface IBalanceListRepository {
  find: (balanceId: number) => Promise<BalanceList>;
}
