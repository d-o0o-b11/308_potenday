import { UserMbti } from '@domain';

export class FindUserMbtiAnswerResponseDto {
  answerUser: UserMbti | null;
  guessingUsers: UserMbti[];
}
