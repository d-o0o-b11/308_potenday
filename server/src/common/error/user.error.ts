import { HttpStatus } from '@nestjs/common';
import { BasicException } from './base.error';
import { ErrorCode, ErrorMessage } from '../constant';

export class UserNotFoundException extends BasicException {
  constructor() {
    super(
      ErrorMessage.USER_NOT_FOUND,
      HttpStatus.NOT_FOUND,
      ErrorCode.USER_NOT_FOUND,
    );
  }
}
