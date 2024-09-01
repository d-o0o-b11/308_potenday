import { DeleteResult, EntityManager, UpdateResult } from 'typeorm';
import { UrlRead } from '../url-read';
import {
  CreateUserUrlReadDto,
  DeleteUserIdDto,
  FindOneByUrlIdDto,
  FindOneUserWithUrlDto,
  UpdateUserIdDto,
  UpdateUserUrlStatusDto,
} from '@application';

export interface IUrlReadRepository {
  /**
   * url 저장
   * @param dto CreateUserUrlReadDto
   * @param manager EntityManager
   * @returns Promise<void>
   */
  create: (dto: CreateUserUrlReadDto, manager: EntityManager) => Promise<void>;

  /**
   * url status 수정
   * @param urlId number
   * @param dto UpdateUserUrlStatusDto
   * @param manager EntityManager
   * @returns Promise<UpdateResult>
   */
  updateStatus: (
    urlId: number,
    dto: UpdateUserUrlStatusDto,
    manager: EntityManager,
  ) => Promise<UpdateResult>;

  /**
   * userIdList에 userId 추가
   * @param urlId number
   * @param dto UpdateUserIdDto
   * @param manager EntityManager
   * @returns Promise<UpdateResult>
   */
  updateUserList: (
    urlId: number,
    dto: UpdateUserIdDto,
    manager: EntityManager,
  ) => Promise<UpdateResult>;

  /**
   * url에 속한 userIdList, status, urlId 조회
   * @param dto FindOneByUrlIdDto
   * @param manager EntityManager
   * @returns Promise<UrlRead>
   */
  findOneById: (
    dto: FindOneByUrlIdDto,
    manager: EntityManager,
  ) => Promise<UrlRead>;

  /**
   * 동일한 url이 존재하는지 확인
   * @param dto FindOneUserWithUrlDto
   * @param manager EntityManager
   * @returns Promise<boolean>
   */
  findOneByUrl: (
    dto: FindOneUserWithUrlDto,
    manager: EntityManager,
  ) => Promise<boolean>;

  /**
   * url 삭제
   * @param urlId number
   * @param manager EntityManager
   * @returns Promise<DeleteResult>
   */
  delete: (urlId: number, manager: EntityManager) => Promise<DeleteResult>;

  /**
   * url에 해당하는 userId 삭제
   * @param urlId number
   * @param userId number
   * @param manager EntityManager
   */
  deleteUserId(
    urlId: number,
    dto: DeleteUserIdDto,
    manager: EntityManager,
  ): Promise<UpdateResult>;
}
