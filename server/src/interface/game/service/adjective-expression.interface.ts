import { CreateUserExpressionAndGetSubmitCountDto } from '@application';
import { UserAdjectiveExpressionSubmitCountDto } from '../dto';

export interface IAdjectiveExpressionService {
  /**
   * 유저 형용사 표현 저장하기 전 이미 제출한 유저인지 확인 후
   * 형용사 표현을 저장하고 현재 제출한 '유저 수' 반환
   */
  saveUserExpressionAndGetSubmitCount: (
    dto: CreateUserExpressionAndGetSubmitCountDto,
  ) => Promise<UserAdjectiveExpressionSubmitCountDto>;
}
