import { SaveUserAdjectiveExpressionDto } from '@application';
import { UserAdjectiveExpression } from '../user-adjective-expression';
import { EntityManager } from 'typeorm';

export interface IAdjectiveExpressionRepository {
  /**
   * 유저 형용사 표현 저장
   * @param dto SaveUserAdjectiveExpressionDto
   * @returns Promise<UserAdjectiveExpression[]>
   */
  create: (
    dto: SaveUserAdjectiveExpressionDto,
  ) => Promise<UserAdjectiveExpression[]>;

  /**
   * 유저 형용사 표현 삭제
   * @param userId number
   * @param manager EntityManager
   * @returns Promise<void>
   */
  delete: (userId: number, manager: EntityManager) => Promise<void>;
}
