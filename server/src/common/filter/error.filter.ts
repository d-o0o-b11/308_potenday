import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { BasicException } from '../error';
import { Response } from 'express';

@Catch(BasicException)
export class BasicExceptionFilter implements ExceptionFilter {
  catch(exception: BasicException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(exception.getStatus()).json({
      code: exception.code,
      status: exception.getStatus(),
      message: exception.message,
    });
  }
}
