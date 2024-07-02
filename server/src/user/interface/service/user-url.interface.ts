import {
  CountUsersInRoomResponseDto,
  FindOneUserUrlDto,
  SetUrlResponseDto,
} from '../dto';

export interface IUserUrlService {
  /**
   * URL 발급
   */
  setUrl: () => Promise<SetUrlResponseDto>;

  /**
   * 해당 URL 인원 수 확인
   * 최대 4명, 초과시 에러 발생
   * @throws {UrlMaximumUserAlreadyClickButtonException}
   */
  checkUserLimitForUrl: (dto: FindOneUserUrlDto) => Promise<number>;

  /**
   * 해당 URL 인원 수 확인
   */
  countUsersInRoom: (urlId: number) => Promise<CountUsersInRoomResponseDto>;

  /**
   * 해당 URL 인원 수가 총 4명이 될 경우 입장 마감처리
   * status:false
   */
  updateStatusFalse: (urlId: number) => Promise<void>;
}
