import { HttpStatus } from '@nestjs/common';
import { BasicException } from './base.error';
import { ERROR_MESSAGES, ERROR_CODES } from '../constant';

export class UrlNotFoundException extends BasicException {
  constructor() {
    super(
      ERROR_MESSAGES.URL_NOT_FOUND,
      HttpStatus.NOT_FOUND,
      ERROR_CODES.URL_NOT_FOUND,
    );
  }
}

/**
 * 409 Conflict
 * 요청이 현재 서버 상태와 충돌하여 처리가 불가능함
 */
export class UrlAlreadyClickButtonException extends BasicException {
  constructor() {
    super(
      ERROR_MESSAGES.URL_ALREADY_CLICK_BUTTON,
      HttpStatus.CONFLICT,
      ERROR_CODES.URL_ALREADY_CLICK_BUTTON,
    );
  }
}

export class UrlMaximumUserAlreadyClickButtonException extends BasicException {
  constructor() {
    super(
      ERROR_MESSAGES.URL_MAXIMUM_USER,
      HttpStatus.CONFLICT,
      ERROR_CODES.URL_MAXIMUM_USER,
    );
  }
}

export class UrlStatusFalseException extends BasicException {
  constructor() {
    super(
      ERROR_MESSAGES.URL_STATUS_FALSE,
      HttpStatus.CONFLICT,
      ERROR_CODES.URL_STATUS_FALSE,
    );
  }
}
