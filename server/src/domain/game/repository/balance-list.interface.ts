import { FindBalanceListDto } from '@interface';
import { BalanceList } from '../balance-list';

export interface IBalanceListRepository {
  /**
   * 밸런스 질문 리스트 출력
   */
  find: (dto: FindBalanceListDto) => Promise<BalanceList>;
}
