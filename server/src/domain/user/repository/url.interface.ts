import { Url } from '../url';
import { DeleteResult, EntityManager, UpdateResult } from 'typeorm';
import { CreateUserUrlDto, UpdateUserUrlDto } from '@application';

export interface IUrlRepository {
  /**
   * url 저장
   * @param dto CreateUserUrlDto
   * @param manager EntityManager
   * @returns Promise<Url>
   */
  save: (dto: CreateUserUrlDto, manager: EntityManager) => Promise<Url>;

  /**
   * url status 수정
   * @param urlId number
   * @param dto UpdateUserUrlDto
   * @param manager EntityManager
   * @returns Promise<void>
   */
  update: (
    urlId: number,
    dto: UpdateUserUrlDto,
    manager: EntityManager,
  ) => Promise<UpdateResult>;

  /**
   * url 삭제
   * @param id number
   * @param manager EntityManager
   * @returns Promise<DeleteResult>
   */
  delete: (id: number, manager: EntityManager) => Promise<DeleteResult>;
}
