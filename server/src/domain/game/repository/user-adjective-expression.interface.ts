import {
  FindUserAdjectiveExpressionDto,
  GroupByUserAdjectiveExpressionDto,
  SaveUserAdjectiveExpressionDto,
} from '@interface';

export interface IUserAdjectiveExpressionRepository {
  /**
   * 유저 형용사 표현 저장
   */
  save: (dto: SaveUserAdjectiveExpressionDto) => Promise<void>;

  /**
   * 유저가 형용사 표현 데이터를 제출했는지 여부 조회
   * 유저 형용사 표현 제출한 경우 true
   * 제출하지 않은 경우 false
   */
  isSubmitUser: (userId: number) => Promise<boolean>;

  /**
   * 해당 URL에 존재하는 유저들의 형용사 표현 조회
   */
  find: (
    dto: FindUserAdjectiveExpressionDto,
  ) => Promise<GroupByUserAdjectiveExpressionDto[]>;
}
