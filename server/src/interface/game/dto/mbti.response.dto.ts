export class UserMbtiAnswer {
  /**
   * userId
   * @example 126
   */
  userId: number;

  /**
   * mbti
   * @example 'ISTJ'
   */
  mbti: string;

  /**
   * name
   * @example 'd_o0o_b11'
   */
  name: string;

  /**
   * imgId
   * @example 2
   */
  imgId: number;
}

export class FindUserMbtiAnswerResponseDto {
  answerUser: UserMbtiAnswer;
  guessingUsers: UserMbtiAnswer[];
}
