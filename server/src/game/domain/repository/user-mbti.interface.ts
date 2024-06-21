import { SaveUserMbtiDto } from '../../interface';
import { UserMbti } from '../user-mbti';

export interface IUserMbtiRepository {
  save: (dto: SaveUserMbtiDto) => Promise<void>;
  find: (toUserId: number) => Promise<UserMbti[]>;
  findUserMbtiAnswer: (toUserId: number) => Promise<{
    answerUser: any;
    guessingUsers: any[];
  }>;
  findUserMbtiByUrlId: (urlId: number) => Promise<UserMbti[]>;
}
