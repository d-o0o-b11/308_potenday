import { ERROR_CODES, ERROR_MESSAGES } from '@common/constant';
import { BasicException } from './base.error';
import { HttpStatus } from '@nestjs/common';

export class UpdateException extends BasicException {
  constructor() {
    super(
      ERROR_MESSAGES.TYPEORM_UPDATE,
      HttpStatus.INTERNAL_SERVER_ERROR,
      ERROR_CODES.TYPEORM_UPDATE,
    );
  }
}
