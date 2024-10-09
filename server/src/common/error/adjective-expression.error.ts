import { HttpStatus } from '@nestjs/common';
import { BasicException } from './base.error';
import { ERROR_CODES, ERROR_MESSAGES } from '../constant';

export class SubmitAdjectiveExpressionException extends BasicException {
  constructor() {
    super(
      ERROR_MESSAGES.SUBMIT_ADJECTIVE_EXPRESSION,
      HttpStatus.CONFLICT,
      ERROR_CODES.SUBMIT_ADJECTIVE_EXPRESSION,
    );
  }
}

export class UpdateAdjectiveExpressionException extends BasicException {
  constructor() {
    super(
      ERROR_MESSAGES.UPDATE_ADJECTIVE_EXPRESSION_SUBMIT,
      HttpStatus.NOT_FOUND,
      ERROR_CODES.UPDATE_ADJECTIVE_EXPRESSION_SUBMIT,
    );
  }
}

export class DeleteAdjectiveExpressionException extends BasicException {
  constructor() {
    super(
      ERROR_MESSAGES.DELETE_ADJECTIVE_EXPRESSION_SUBMIT,
      HttpStatus.NOT_FOUND,
      ERROR_CODES.DELETE_ADJECTIVE_EXPRESSION_SUBMIT,
    );
  }
}

export class DeleteAdjectiveExpressionListException extends BasicException {
  constructor() {
    super(
      ERROR_MESSAGES.DELETE_ADJECTIVE_EXPRESSION_LIST_SUBMIT,
      HttpStatus.NOT_FOUND,
      ERROR_CODES.DELETE_ADJECTIVE_EXPRESSION_LIST_SUBMIT,
    );
  }
}
