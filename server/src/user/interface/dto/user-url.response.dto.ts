import { User } from '../../domain';

export class UserUrlResponseDto {
  /**
   * URL ID
   * @example 33
   */
  id: number;
}

export class CountUsersInRoomResponseDto {
  /**
   * 인원 수
   * @example 0
   */
  userCount: number;

  /**
   * 인원 정보
   * @example []
   */
  userInfo: User[];
}
