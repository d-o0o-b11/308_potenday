import { PatchCommonQuestionDto, SaveCommonQuestionDto } from '../../interface';

export interface ICommonQuestionRepository {
  /**
   * URL 공통 질문 선택 리스트 저장
   */
  save: (dto: SaveCommonQuestionDto) => Promise<void>;

  /**
   * 공통 질문 다음으로 넘어가기 버튼 클릭시 화면 전환
   */
  update: (dto: PatchCommonQuestionDto) => Promise<void>;
}
