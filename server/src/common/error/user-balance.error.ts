import { HttpStatus } from '@nestjs/common';
import { BasicException } from './base.error';
import { ERROR_CODES, ERROR_MESSAGES } from '../constant';

export class UserBalanceException extends BasicException {
  constructor() {
    super(
      ERROR_MESSAGES.USER_BALANCE_SUBMIT,
      HttpStatus.CONFLICT,
      ERROR_CODES.USER_BALANCE_SUBMIT,
    );
  }
}
