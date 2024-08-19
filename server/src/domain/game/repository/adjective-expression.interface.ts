import { CreateUserAdjectiveExpressionDto } from '@interface';
import { UserAdjectiveExpression } from '../user-adjective-expression';
import { EntityManager } from 'typeorm';

export interface IAdjectiveExpressionRepository {
  /**
   * 유저 형용사 표현 저장
   */
  create: (
    dto: CreateUserAdjectiveExpressionDto,
  ) => Promise<UserAdjectiveExpression[]>;

  /**
   * 유저 형용사 표현 삭제
   * @returns
   */
  delete: (userId: number, manager: EntityManager) => Promise<void>;
}
