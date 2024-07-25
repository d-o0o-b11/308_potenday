import { AdjectiveExpression } from '../adjective-expression';

export interface IAdjectiveExpressionRepository {
  /**
   * 형용사 표현 리스트 출력
   */
  find: () => Promise<AdjectiveExpression[]>;
}
