import { HttpStatus } from '@nestjs/common';
import { BasicException } from './base.error';
import { ERROR_CODES, ERROR_MESSAGES } from '../constant';

export class UserSubmitAdjectiveExpressionException extends BasicException {
  constructor() {
    super(
      ERROR_MESSAGES.USER_ADJECTIVE_EXPRESSION_SUBMIT,
      HttpStatus.CONFLICT,
      ERROR_CODES.USER_ADJECTIVE_EXPRESSION_SUBMIT,
    );
  }
}
