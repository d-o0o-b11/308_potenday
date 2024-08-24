import {
  CalculatePercentagesResponseDto,
  CreateBalanceReadDto,
  DeleteUserBalanceReadDto,
  FindSubmitUserDto,
  FindUserBalanceDto,
  FindUserCountResponseDto,
} from '@interface';
import { EntityManager, UpdateResult } from 'typeorm';

export interface IBalanceReadRepository {
  /**
   * 밸런스 의견 저장
   * @param dto CreateBalanceReadDto
   * @param manager EntityManager
   * @returns Promise<void>
   */
  create: (dto: CreateBalanceReadDto, manager: EntityManager) => Promise<void>;

  /**
   * 밸런스 의견 제출한 유저인지 확인
   * @param dto FindSubmitUserDto
   * @param manager EntityManager
   * @returns Promise<boolean>
   */
  isSubmitUser: (
    dto: FindSubmitUserDto,
    manager: EntityManager,
  ) => Promise<boolean>;

  /**
   * 해당 라운드에 몇명이 재출했는지 확인
   * @param dto FindUserBalanceDto
   * @param manager EntityManager
   * @returns Promise<FindUserCountResponseDto>
   */
  findUserCount: (
    dto: FindUserBalanceDto,
    manager: EntityManager,
  ) => Promise<FindUserCountResponseDto>;

  /**
   * 해당 라운드에 제출한 밸런스 결과 조회
   * @param dto
   * @param manager
   * @returns Promise<CalculatePercentagesResponseDto[]>
   */
  find: (
    dto: FindUserBalanceDto,
    manager: EntityManager,
  ) => Promise<CalculatePercentagesResponseDto[]>;

  /**
   * 밸런스 삭제
   * @param dto DeleteUserBalanceReadDto
   * @param manager EntityManager
   * @returns Promise<UpdateResult>
   */
  delete: (
    dto: DeleteUserBalanceReadDto,
    manager: EntityManager,
  ) => Promise<UpdateResult>;
}
