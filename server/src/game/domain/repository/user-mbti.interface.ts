import { FindUserMbtiAnswerResponseDto } from '@game/interface/dto/user-mbti.response.dto';
import {
  FindUserMbtiByUrlIdDto,
  FindUserMbtiDto,
  SaveUserMbtiDto,
} from '../../interface';
import { UserMbti } from '../user-mbti';

export interface IUserMbtiRepository {
  /**
   * 추측한 유저 mbti 정보 저장
   */
  save: (dto: SaveUserMbtiDto) => Promise<void>;

  /**
   * 추측한 유저 mbti 데이터 조회
   */
  find: (dto: FindUserMbtiDto) => Promise<UserMbti[]>;

  /**
   * 추측한 유저 mbti 가공된 데이터 조회
   */
  findUserMbtiAnswer: (
    dto: FindUserMbtiDto,
  ) => Promise<FindUserMbtiAnswerResponseDto>;

  /**
   * URL에 해당하는 유저 MBTI 조회
   */
  findUserMbtiByUrlId: (dto: FindUserMbtiByUrlIdDto) => Promise<UserMbti[]>;
}
