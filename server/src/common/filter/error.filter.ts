import { BasicException } from '@common/error';
import { SlackService } from '@common/utils';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private slackService = new SlackService();

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = (exception as any).message;
    let code: string;
    const stack: string = (exception as any).stack;

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
    } else if (exception instanceof EntityNotFoundError) {
      code = 'ENTITY_NOT_FOUND';
      status = HttpStatus.NOT_FOUND;
      message = 'Entity not found';
    } else {
      code = 'INTERNAL_SERVER_ERROR';
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal Server Error';
    }

    const slackMessage = `
  - Code: ${code}
  - Status: ${status}
  - Path: ${request.method} ${request.url}
  - Timestamp: ${new Date().toISOString()}
  - Message: ${message}
  - Stack Trace: ${stack || 'Null'}
  `;
    this.slackService.sendErrorMessage(slackMessage);

    response.status(status).json({
      code: code,
      status: status,
      timestamp: new Date().toISOString(),
      path: `${request.method} ${request.url}`,
      message: message,
    });
  }
}
