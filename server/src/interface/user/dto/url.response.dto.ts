import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { UserRead } from '@domain';

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
  userInfo: UserRead[];
}

export class CountUserListInRoomResponseDto {
  /**
   * 인원 수
   * @example 0
   */
  userCount: number;

  /**
   * 유저 정보
   */
  userInfo: UserInfoResponseDto[];
}

class UserInfoResponseDto {
  /**
   * 유저 ID
   * @example 11
   */
  id: number;

  /**
   * 이미지 ID
   * @example 2
   */
  imgId: number;

  /**
   * 닉네임
   * @example 'd_o0o_b'
   */
  nickName: string;
}

export class CountUsersInRoomDto {
  /**
   * 인원 수
   * @example 4
   */
  userCount: number;

  //스웨거 처리 필요 TODO
  userInfo: UserRead[];

  /**
   * 방 입장 여부
   * @example false
   */
  status: boolean;
}

export class GetUrlStatusResponseDto {
  /**
   * URL 입장 여부
   * @example true
   */
  @IsBoolean()
  status: boolean;
}
