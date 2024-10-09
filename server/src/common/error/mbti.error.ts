import { HttpStatus } from '@nestjs/common';
import { BasicException } from './base.error';
import { ERROR_CODES, ERROR_MESSAGES } from '../constant';

export class SubmitMbtiException extends BasicException {
  constructor() {
    super(
      ERROR_MESSAGES.SUBMIT_USER_MBTI,
      HttpStatus.CONFLICT,
      ERROR_CODES.SUBMIT_USER_MBTI,
    );
  }
}

export class CreateMbtiException extends BasicException {
  constructor() {
    super(
      ERROR_MESSAGES.CREATE_MBTI,
      HttpStatus.CONFLICT,
      ERROR_CODES.CREATE_MBTI,
    );
  }
}

export class NotFoundMbtiException extends BasicException {
  constructor() {
    super(
      ERROR_MESSAGES.NOT_FOUND_MBTI,
      HttpStatus.NOT_FOUND,
      ERROR_CODES.NOT_FOUND_MBTI,
    );
  }
}

export class DeleteMbtiException extends BasicException {
  constructor() {
    super(
      ERROR_MESSAGES.DELETE_MBTI,
      HttpStatus.NOT_FOUND,
      ERROR_CODES.DELETE_MBTI,
    );
  }
}
