import {
  CalculatePercentagesResponseDto,
  FindUserBalanceDto,
  FindUserCountResponseDto,
  SaveUserBalanceDto,
} from '../../interface';

export interface IUserBalanceRepository {
  /**
   * 밸런스 게임 종류 저장
   */
  save: (dto: SaveUserBalanceDto) => Promise<void>;

  /**
   * 밸런스 게임 답변한 인원 수
   */
  findUserCount: (dto: FindUserBalanceDto) => Promise<FindUserCountResponseDto>;

  /**
   * 밸런스 선택한 유저 정보, 퍼센트 결과 조회
   */
  find(dto: FindUserBalanceDto): Promise<CalculatePercentagesResponseDto[]>;
}
