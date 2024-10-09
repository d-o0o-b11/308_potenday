import { SaveUserMbtiDto, UserMbtiSubmitCountDto } from '@application';

export interface IMbtiService {
  /**
   * 유저 mbti 값 저장하기 전 이미 제출한 유저인지 확인 후
   * mbti 값을 저장하고 현재 제출한 '유저 수' 반환
   */
  saveUserMbtiAndGetSubmitCount: (
    dto: SaveUserMbtiDto,
  ) => Promise<UserMbtiSubmitCountDto>;
}
