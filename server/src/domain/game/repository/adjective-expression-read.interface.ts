import { EntityManager, UpdateResult } from 'typeorm';
import { UserRead } from '@domain';
import { CreateUserAdjectiveExpressionReadDto } from '@application';

export interface IAdjectiveExpressionRepositoryReadRepository {
  /**
   * 형용사 표현 저장
   * @param dto CreateUserAdjectiveExpressionReadDto
   * @param manager EntityManager
   * @returns Promise<void>
   */
  create: (
    dto: CreateUserAdjectiveExpressionReadDto,
    manager: EntityManager,
  ) => Promise<void>;

  /**
   * 형용사 표현 삭제
   * @param userId number
   * @param manager EntityManager
   * @returns Promise<UpdateResult>
   */
  delete: (userId: number, manager: EntityManager) => Promise<UpdateResult>;

  /**
   * 형용사 표현 제춯한 user 확인
   * @param userId number
   * @param manager EntityManager
   * @returns Promise<boolean>
   */
  isSubmitUser: (userId: number, manager: EntityManager) => Promise<boolean>;

  /**
   * url에 속한 유저의 형용사 표현 조회
   * @param urlId number
   * @param manager EntityManager
   * @returns Promise<UserRead[]>
   */
  findUsersByUrlId: (
    urlId: number,
    manager: EntityManager,
  ) => Promise<UserRead[]>;
}
