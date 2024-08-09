import { UserUrl } from '@domain';
import { CountUsersInRoomResponseDto, FindOneUserUrlDto } from '../dto';
import { EntityManager } from 'typeorm';

export interface IUserUrlService {
  /**
   * URL 발급
   */
  setUrl: () => Promise<UserUrl>;

  /**
   * 해당 URL 인원 수 확인
   * 최대 4명, 초과시 에러 발생
   * @throws {UrlMaximumUserAlreadyClickButtonException}
   */
  checkUserLimitForUrl: (
    dto: FindOneUserUrlDto,
  ) => Promise<CountUsersInRoomResponseDto>;

  /**
   * 해당 URL 인원 수 확인
   */
  countUsersInRoom: (
    userIdList: number[],
    manager: EntityManager,
  ) => Promise<CountUsersInRoomResponseDto>;

  /**
   * 해당 URL 인원 수가 총 4명이 될 경우 입장 마감처리
   * status:false
   */
  updateStatusFalse: (urlId: number) => Promise<void>;
}
