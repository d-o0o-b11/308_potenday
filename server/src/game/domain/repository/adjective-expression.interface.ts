import { AdjectiveExpression } from '../adjective-expression';

export interface IAdjectiveExpressionRepository {
  find: () => Promise<AdjectiveExpression[]>;
}
