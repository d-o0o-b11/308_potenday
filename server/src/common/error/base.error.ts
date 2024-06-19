import { HttpException } from '@nestjs/common';

export class BaseError extends Error {
  public status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export class BasicException extends HttpException {
  code: string;

  constructor(message: string, status: number, code: string) {
    super(message, status);
    this.code = code;
  }
}
