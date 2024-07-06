import { BasicException } from '@common/error';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(HttpException, QueryFailedError)
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = (exception as any).message;
    let code: string;

    if (exception instanceof BasicException) {
      status = exception.getStatus();
      code = exception.code;
      message = exception.message;
    } else if (exception instanceof HttpException) {
      code = 'INTERNET_SERVER_ERROR';
      status = exception.getStatus();
      message = exception.getResponse();
    } else if (exception instanceof QueryFailedError) {
      code = 'QUERY_ERROR';
      status = HttpStatus.BAD_REQUEST;
      message = 'Database query failed';
    }

    response.status(status).json({
      code: code,
      status: status,
      timestamp: new Date().toISOString(),
      path: `${request.method} ${request.url}`,
      message: message,
    });
  }
}
