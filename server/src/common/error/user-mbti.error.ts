import { HttpStatus } from '@nestjs/common';
import { BasicException } from './base.error';
import { ErrorCode, ErrorMessage } from '../constant';

export class UserMbtiException extends BasicException {
  constructor() {
    super(
      ErrorMessage.USER_MBTI_SUBMIT,
      HttpStatus.CONFLICT,
      ErrorCode.USER_MBTI_SUBMIT,
    );
  }
}
