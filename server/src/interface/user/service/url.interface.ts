import { Url } from '@domain';
import {
  CountUsersInRoomDto,
  CountUsersInRoomResponseDto,
  FindOneUserUrlDto,
} from '../dto';
import { EntityManager } from 'typeorm';

export interface IUrlService {
  /**
   * url 저장
   * @returns Promise<Url>
   */
  setUrl: () => Promise<Url>;

  /**
   * url 인원 수 확인
   * @param dto FindOneUserUrlDto
   * @returns Promise<CountUsersInRoomResponseDto>
   *
   * @throws url 존재하지 않는 경우 UrlNotFoundException()
   */
  checkUserLimitForUrl: (
    dto: FindOneUserUrlDto,
  ) => Promise<CountUsersInRoomDto>;

  /**
   * url 인원 수, user 정보 조회
   * @param userIdList number[]
   * @param manager EntityManager
   * @returns Promise<CountUsersInRoomResponseDto>
   */
  countUsersInRoom: (
    userIdList: number[],
    manager: EntityManager,
  ) => Promise<CountUsersInRoomResponseDto>;

  /**
   * url status false 수정
   * @param urlId number
   * @returns Promise<void>
   */
  updateStatusFalse: (urlId: number) => Promise<void>;
}
