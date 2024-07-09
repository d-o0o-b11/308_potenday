import { HttpStatus } from '@nestjs/common';
import { BasicException } from './base.error';
import { ERROR_CODES, ERROR_MESSAGES } from '../constant';

export class UserMbtiException extends BasicException {
  constructor() {
    super(
      ERROR_MESSAGES.USER_MBTI_SUBMIT,
      HttpStatus.CONFLICT,
      ERROR_CODES.USER_MBTI_SUBMIT,
    );
  }
}
