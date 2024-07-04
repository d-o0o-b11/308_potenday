import { HttpStatus } from '@nestjs/common';
import { BasicException } from './base.error';
import { ErrorCode, ErrorMessage } from '../constant';

export class UserSubmitAdjectiveExpressionException extends BasicException {
  constructor() {
    super(
      ErrorMessage.USER_ADJECTIVE_EXPRESSION_SUBMIT,
      HttpStatus.CONFLICT,
      ErrorCode.USER_ADJECTIVE_EXPRESSION_SUBMIT,
    );
  }
}
