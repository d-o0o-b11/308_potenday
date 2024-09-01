import { EntityManager, UpdateResult } from 'typeorm';
import { UserMbti } from '../user-mbti';
import {
  CreateMbtiReadDto,
  DeleteUserMbtiReadDto,
  FindSubmitMbtiUserDto,
  FindUserCountResponseDto,
  FindUserMbtiDto,
} from '@application';

export interface IMbtiReadRepository {
  /**
   * mbti 저장
   * @param dto CreateMbtiReadDto
   * @returns Promise<void>
   */
  create: (dto: CreateMbtiReadDto, manager: EntityManager) => Promise<void>;

  /**
   * mbti 제출했는지 조회
   * @param dto FindSubmitMbtiUserDto
   * @param manager EntityManager
   * @returns Promise<boolean>
   */
  isSubmitUser: (
    dto: FindSubmitMbtiUserDto,
    manager: EntityManager,
  ) => Promise<boolean>;

  /**
   * 해당 라운드에 몇명이 mbti 제출했는지 조회
   * @param dto FindUserMbtiDto
   * @param manager EntityManager
   * @returns Promise<FindUserCountResponseDto>
   */
  findUserCount: (
    dto: FindUserMbtiDto,
    manager: EntityManager,
  ) => Promise<FindUserCountResponseDto>;

  /**
   * url에 속한 유저 mbti 조회
   * @param urlId number
   * @param manager EntityManager
   * @returns Promise<UserMbti[]>
   */
  find: (urlId: number, manager: EntityManager) => Promise<UserMbti[]>;

  /**
   * mbti 결과 조회
   * @param dto FindUserMbtiDto
   * @param manager EntityManager
   * @returns Promise<UserMbti[]>
   */
  findSubmitList: (
    dto: FindUserMbtiDto,
    manager: EntityManager,
  ) => Promise<UserMbti[]>;

  /**
   * mbti 삭제
   * @param dto DeleteUserMbtiReadDto
   * @param manager EntityManager
   * @returns Promise<UpdateResult>
   */
  delete: (
    dto: DeleteUserMbtiReadDto,
    manager: EntityManager,
  ) => Promise<UpdateResult>;
}
