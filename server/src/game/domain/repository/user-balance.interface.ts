import { UserBalance } from '../user-balance';

export interface IUserBalanceRepository {
  save: (
    userId: number,
    balanceId: number,
    balanceType: string,
  ) => Promise<void>;
  find: (urlId: number) => Promise<UserBalance[]>;
  findUserBalance: (
    urlId: number,
    balanceId: number,
  ) => Promise<
    {
      balanceType: any;
      users: any;
      percent: string;
    }[]
  >;
}
