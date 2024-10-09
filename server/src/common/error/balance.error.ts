import { HttpStatus } from '@nestjs/common';
import { BasicException } from './base.error';
import { ERROR_CODES, ERROR_MESSAGES } from '../constant';

export class SubmitBalanceException extends BasicException {
  constructor() {
    super(
      ERROR_MESSAGES.SUBMIT_USER_BALANCE,
      HttpStatus.CONFLICT,
      ERROR_CODES.SUBMIT_USER_BALANCE,
    );
  }
}

export class UpdateBalanceException extends BasicException {
  constructor() {
    super(
      ERROR_MESSAGES.UPDATE_BALANCE,
      HttpStatus.NOT_FOUND,
      ERROR_CODES.UPDATE_BALANCE,
    );
  }
}

export class NotFoundBalanceListException extends BasicException {
  constructor() {
    super(
      ERROR_MESSAGES.NOT_FOUND_BALANCE_LIST,
      HttpStatus.NOT_FOUND,
      ERROR_CODES.NOT_FOUND_BALANCE_LIST,
    );
  }
}

export class NotFoundBalanceException extends BasicException {
  constructor() {
    super(
      ERROR_MESSAGES.NOT_FOUND_BALANCE,
      HttpStatus.NOT_FOUND,
      ERROR_CODES.NOT_FOUND_BALANCE,
    );
  }
}

export class DeleteBalanceException extends BasicException {
  constructor() {
    super(
      ERROR_MESSAGES.DELETE_BALANCE,
      HttpStatus.NOT_FOUND,
      ERROR_CODES.DELETE_BALANCE,
    );
  }
}
