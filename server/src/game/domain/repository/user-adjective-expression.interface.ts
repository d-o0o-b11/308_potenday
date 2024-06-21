import { GroupByUserAdjectiveExpressionDto } from '../../interface';

export interface IUserAdjectiveExpressionRepository {
  save: (userId: number, adjectiveExpressionIds: number[]) => Promise<void>;
  find: (urlId: number) => Promise<GroupByUserAdjectiveExpressionDto[]>;
}
