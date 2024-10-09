import { UserBalance } from '../user-balance';
import { EntityManager, UpdateResult } from 'typeorm';
import { CreateUserBalanceDto, DeleteUserBalanceDto } from '@application';

export interface IBalanceRepository {
  /**
   * 밸런스 리스트 저장
   * @param dto CreateUserBalanceDto
   * @returns Promise<UserBalance>
   */
  create: (dto: CreateUserBalanceDto) => Promise<UserBalance>;

  /**
   * 유저 밸런스 삭제
   * @param dto DeleteUserBalanceDto
   * @param manager EntityManager
   * @returns Promise<UpdateResult>
   */
  delete: (
    dto: DeleteUserBalanceDto,
    manager: EntityManager,
  ) => Promise<UpdateResult>;
}
