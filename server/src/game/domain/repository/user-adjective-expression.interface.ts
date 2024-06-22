import {
  FindUserAdjectiveExpressionDto,
  GroupByUserAdjectiveExpressionDto,
  SaveUserAdjectiveExpressionDto,
} from '../../interface';

export interface IUserAdjectiveExpressionRepository {
  /**
   * 유저 형용사 표현 저장
   */
  save: (dto: SaveUserAdjectiveExpressionDto) => Promise<void>;

  /**
   * 해당 URL에 존재하는 유저들의 형용사 표현 조회
   */
  find: (
    dto: FindUserAdjectiveExpressionDto,
  ) => Promise<GroupByUserAdjectiveExpressionDto[]>;
}
