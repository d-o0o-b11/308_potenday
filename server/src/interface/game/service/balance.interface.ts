import { CreateBalanceDto, UserBalanceSubmitCountDto } from '../dto';

export interface IBalanceService {
  /**
   * 유저 밸런스 의견 저장하기 전 이미 제출한 유저인지 확인 후
   * 밸런스 의견을 저장하고 현재 제출한 '유저 수' 반환
   */
  saveUserExpressionAndGetSubmitCount: (
    dto: CreateBalanceDto,
  ) => Promise<UserBalanceSubmitCountDto>;
}
