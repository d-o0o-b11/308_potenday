import { HttpStatus } from '@nestjs/common';
import { BasicException } from './base.error';
import { ErrorCode, ErrorMessage } from '../constant';

export class UserBalanceException extends BasicException {
  constructor() {
    super(
      ErrorMessage.USER_BALANCE_SUBMIT,
      HttpStatus.CONFLICT,
      ErrorCode.USER_BALANCE_SUBMIT,
    );
  }
}
