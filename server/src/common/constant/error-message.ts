export const ERROR_MESSAGES = {
  USER_NOT_FOUND: '존재하지 않는 사용자 입니다.',

  URL_NOT_FOUND: '존재하지 않는 URL 입니다.',
  URL_ALREADY_CLICK_BUTTON: '다른 사용자가 버튼을 누른 상태입니다.',
  URL_MAXIMUM_USER: '최대 4명까지 이용할 수 있습니다.',
  URL_STATUS_FALSE: '해당 방은 게임 중이여서 입장이 불가능합니다.',

  USER_ADJECTIVE_EXPRESSION_SUBMIT: '이미 형용사 표현 값을 제출하였습니다.',

  USER_BALANCE_SUBMIT: '이미 해당 라운드 밸런스 게임에 의견을 제출하였습니다.',

  USER_MBTI_SUBMIT: '이미 해당 mbti 값을 제출하였습니다.',

  TYPEORM_UPDATE: '업데이트 과정에서 오류가 발생하였습니다.',
} as const;
export type ERROR_MESSAGE =
  (typeof ERROR_MESSAGES)[keyof typeof ERROR_MESSAGES];
