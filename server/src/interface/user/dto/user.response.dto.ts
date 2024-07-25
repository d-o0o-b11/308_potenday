export class UserResponseDto {
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

  /**
   * 온보딩 여부
   * @example false
   */
  onboarding?: boolean;

  /**
   * URL ID
   * @example 30
   */
  urlId: number;
}
