export const ERROR_MESSAGES = {
  DELETE_USER: 'user 삭제 과정에서 오류가 발생하였습니다.',

  NOT_FOUND_URL: '존재하지 않는 URL 입니다.',
  ALREADY_CLICK_BUTTON_URL: '다른 사용자가 버튼을 누른 상태입니다.',
  MAXIMUM_URL: '최대 4명까지 이용할 수 있습니다.',
  STATUS_FALSE_URL: '해당 방은 게임 중이여서 입장이 불가능합니다.',
  UPDATE_URL: 'url status 변경 과정에서 오류가 발생하였습니다.',
  UPDATE_URL_USER_ID_LIST: 'userIdList 변경 과정에서 오류가 발생하였습니다.',
  DELETE_URL: 'url 삭제 과정에서 오류가 발생하였습니다.',
  DELETE_URL_USER_ID: 'user id 삭제 과정에서 오류가 발생하였습니다.',

  SUBMIT_ADJECTIVE_EXPRESSION: '이미 형용사 표현 값을 제출하였습니다.',
  UPDATE_ADJECTIVE_EXPRESSION_SUBMIT:
    'AdjectiveExpressionList 업데이트 과정에서 오류가 발생하였습니다.',
  DELETE_ADJECTIVE_EXPRESSION_SUBMIT:
    'AdjectiveExpressionList 삭제 과정에서 오류가 발생하였습니다.',
  DELETE_ADJECTIVE_EXPRESSION_LIST_SUBMIT:
    '형용사 표현 삭제 과정에서 오류가 발생하였습니다.',

  SUBMIT_USER_BALANCE: '이미 해당 라운드 밸런스 게임에 의견을 제출하였습니다.',
  UPDATE_BALANCE: 'balance 업데이트 과정에서 오류가 발생하였습니다.',
  NOT_FOUND_BALANCE_LIST: 'balance 게임 종류를 찾지 못하였습니다.',
  DELETE_BALANCE: 'balance 삭제 과정에서 오류가 발생하였습니다.',
  NOT_FOUND_BALANCE: 'balance 데이터가 존재하지 않습니다.',

  SUBMIT_USER_MBTI: '이미 해당 mbti 값을 제출하였습니다.',
  CREATE_MBTI: 'mbti 생성 과정에서 오류가 발생하였습니다.',
  NOT_FOUND_MBTI: 'mbti 데이터가 존재하지 않습니다.',
  DELETE_MBTI: 'mbti 삭제 과정에서 오류가 발생하였습니다.',

  TYPEORM_UPDATE: '업데이트 과정에서 오류가 발생하였습니다.',
} as const;
export type ERROR_MESSAGE =
  (typeof ERROR_MESSAGES)[keyof typeof ERROR_MESSAGES];
