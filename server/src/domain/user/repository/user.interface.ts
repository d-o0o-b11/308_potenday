import { CreateUserDto } from '@application';
import { User } from '../user';
import { DeleteResult, EntityManager } from 'typeorm';

export interface IUserRepository {
  /**
   * 유저 생성
   * @param dto CreateUserDto
   * @returns Promise<User>
   */
  create: (dto: CreateUserDto) => Promise<User>;

  /**
   * 유저 삭제
   * @param id number
   * @param manager EntityManager
   * @returns Promise<DeleteResult>
   */
  delete: (id: number, manager: EntityManager) => Promise<DeleteResult>;
}
