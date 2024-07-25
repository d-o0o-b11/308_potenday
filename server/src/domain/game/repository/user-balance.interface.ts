import {
  CalculatePercentagesResponseDto,
  FindSubmitUserDto,
  FindUserBalanceDto,
  FindUserCountResponseDto,
  SaveUserBalanceDto,
} from '@interface';

export interface IUserBalanceRepository {
  /**
   * 밸런스 게임 종류 저장
   */
  save: (dto: SaveUserBalanceDto) => Promise<void>;

  /**
   * 유저가 밸런스 게임 의견을 제출했는지 여부 조회
   * 유저가 의견 제출한 경우 true
   * 제출하지 않은 경우 false
   */
  isSubmitUser: (dto: FindSubmitUserDto) => Promise<boolean>;

  /**
   * 밸런스 게임 답변한 인원 수
   */
  findUserCount: (dto: FindUserBalanceDto) => Promise<FindUserCountResponseDto>;

  /**
   * 밸런스 선택한 유저 정보, 퍼센트 결과 조회
   */
  find(dto: FindUserBalanceDto): Promise<CalculatePercentagesResponseDto[]>;
}
