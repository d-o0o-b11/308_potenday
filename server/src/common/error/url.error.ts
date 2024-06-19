import { HttpStatus } from '@nestjs/common';
import { BasicException } from './base.error';
import { ErrorCode, ErrorMessage } from '../constant';

export class UrlNotFoundException extends BasicException {
  constructor() {
    super(
      ErrorMessage.URL_NOT_FOUND,
      HttpStatus.NOT_FOUND,
      ErrorCode.URL_NOT_FOUND,
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
      ErrorMessage.URL_ALREADY_CLICK_BUTTON,
      HttpStatus.CONFLICT,
      ErrorCode.URL_ALREADY_CLICK_BUTTON,
    );
  }
}

export class UrlMaximumUserAlreadyClickButtonException extends BasicException {
  constructor() {
    super(
      ErrorMessage.URL_MAXIMUM_USER,
      HttpStatus.CONFLICT,
      ErrorCode.URL_MAXIMUM_USER,
    );
  }
}
