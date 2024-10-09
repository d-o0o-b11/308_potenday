import { DeleteResult, EntityManager } from 'typeorm';
import { UserRead } from '../user-read';
import { CreateUserReadDto } from '@application';

export interface IUserReadRepository {
  /**
   * user 생성
   * @param dto CreateUserReadDto
   * @param manager EntityManager
   * @returns Promise<void>
   */
  create: (dto: CreateUserReadDto, manager: EntityManager) => Promise<void>;

  /**
   * url에 해당하는 user 상세 조회
   * @param userIdList number[]
   * @param manager EntityManager
   * @returns Promise<UserRead[]>
   */
  findList: (
    userIdList: number[],
    manager: EntityManager,
  ) => Promise<UserRead[]>;

  /**
   * user 삭제
   * @param id number
   * @param manager EntityManager
   * @returns Promise<DeleteResult>
   */
  delete: (id: number, manager: EntityManager) => Promise<DeleteResult>;
}
