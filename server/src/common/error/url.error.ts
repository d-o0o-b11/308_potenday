import { HttpStatus } from '@nestjs/common';
import { BasicException } from './base.error';
import { ERROR_MESSAGES, ERROR_CODES } from '../constant';

export class NotFoundUrlException extends BasicException {
  constructor() {
    super(
      ERROR_MESSAGES.NOT_FOUND_URL,
      HttpStatus.NOT_FOUND,
      ERROR_CODES.NOT_FOUND_URL,
    );
  }
}

/**
 * 409 Conflict
 * 요청이 현재 서버 상태와 충돌하여 처리가 불가능함
 */
export class AlreadyClickButtonUrlException extends BasicException {
  constructor() {
    super(
      ERROR_MESSAGES.ALREADY_CLICK_BUTTON_URL,
      HttpStatus.CONFLICT,
      ERROR_CODES.ALREADY_CLICK_BUTTON_URL,
    );
  }
}

export class MaximumUrlException extends BasicException {
  constructor() {
    super(
      ERROR_MESSAGES.MAXIMUM_URL,
      HttpStatus.CONFLICT,
      ERROR_CODES.MAXIMUM_URL,
    );
  }
}

export class StatusFalseUrlException extends BasicException {
  constructor() {
    super(
      ERROR_MESSAGES.STATUS_FALSE_URL,
      HttpStatus.CONFLICT,
      ERROR_CODES.STATUS_FALSE_URL,
    );
  }
}

export class UpdateUrlException extends BasicException {
  constructor() {
    super(
      ERROR_MESSAGES.UPDATE_URL,
      HttpStatus.NOT_FOUND,
      ERROR_CODES.UPDATE_URL,
    );
  }
}

export class UpdateUrlUserIdListException extends BasicException {
  constructor() {
    super(
      ERROR_MESSAGES.UPDATE_URL_USER_ID_LIST,
      HttpStatus.CONFLICT,
      ERROR_CODES.UPDATE_URL_USER_ID_LIST,
    );
  }
}

export class DeleteUrlException extends BasicException {
  constructor() {
    super(
      ERROR_MESSAGES.DELETE_URL,
      HttpStatus.CONFLICT,
      ERROR_CODES.DELETE_URL,
    );
  }
}

export class DeleteUrlUserIdException extends BasicException {
  constructor() {
    super(
      ERROR_MESSAGES.DELETE_URL_USER_ID,
      HttpStatus.CONFLICT,
      ERROR_CODES.DELETE_URL_USER_ID,
    );
  }
}
