import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { User } from '@domain';

export class SetUrlResponseDto {
  /**
   * URL ID
   * @example 11
   */
  @IsNumber()
  id: number;

  /**
   * URL
   * @example 'axdvd'
   */
  @IsString()
  url: string;
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

export class GetUrlStatusResponseDto {
  /**
   * URL 입장 여부
   * @example true
   */
  @IsBoolean()
  status: boolean;
}
