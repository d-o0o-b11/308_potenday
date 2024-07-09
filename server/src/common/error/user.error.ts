import { HttpStatus } from '@nestjs/common';
import { BasicException } from './base.error';
import { ERROR_CODES, ERROR_MESSAGES } from '../constant';

export class UserNotFoundException extends BasicException {
  constructor() {
    super(
      ERROR_MESSAGES.USER_NOT_FOUND,
      HttpStatus.NOT_FOUND,
      ERROR_CODES.USER_NOT_FOUND,
    );
  }
}
