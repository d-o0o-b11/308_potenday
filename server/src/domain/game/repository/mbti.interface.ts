import { CreateUserMbtiDto } from '@application';
import { UserMbti } from '../user-mbti';
import { EntityManager, UpdateResult } from 'typeorm';

export interface IMbtiRepository {
  /**
   * mbti 저장
   * @param dto CreateUserMbtiDto
   * @returns Promise<UserMbti>
   */
  create: (dto: CreateUserMbtiDto) => Promise<UserMbti>;

  /**
   * mbti 삭제
   * @param id number
   * @param manager EntityManager
   * @returns Promise<UpdateResult>
   */
  delete: (id: number, manager: EntityManager) => Promise<UpdateResult>;
}
