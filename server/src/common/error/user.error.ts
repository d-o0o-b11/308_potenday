import { HttpStatus } from '@nestjs/common';
import { BasicException } from './base.error';
import { ERROR_CODES, ERROR_MESSAGES } from '../constant';

export class DeleteUserException extends BasicException {
  constructor() {
    super(
      ERROR_MESSAGES.DELETE_USER,
      HttpStatus.NOT_FOUND,
      ERROR_CODES.DELETE_USER,
    );
  }
}
