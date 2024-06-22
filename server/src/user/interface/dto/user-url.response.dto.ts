import { IsBoolean, IsString } from 'class-validator';
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

export class GetUrlResponseDto {
  /**
   * URL
   * @example 'dfsdf'
   */
  @IsString()
  url: string;
}

export class GetUrlStatusResponseDto {
  /**
   * URL 입장 여부
   * @example true
   */
  @IsBoolean()
  status: boolean;
}
