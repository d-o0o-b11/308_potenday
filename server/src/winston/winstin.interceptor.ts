import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Scope,
  HttpException,
} from '@nestjs/common';
// import { Observable } from "rxjs";
import { catchError, Observable, throwError, finalize } from 'rxjs';
import { LoggerService } from './winston.service';

@Injectable({ scope: Scope.REQUEST })
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // const request = context.switchToHttp().getRequest();
    const incomingMessage = context.getArgByIndex(0);

    const http = context.switchToHttp();
    const req = http.getRequest();
    // this.logger.log(`Request ${request.method} ${request.url}`);
    this.logger.req(req.method, req?.originalUrl);

    return next.handle().pipe(
      catchError((e) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars

        const { message, ...res } = e;
        this.logger.error(incomingMessage?.originalUrl, res);

        // throw again the error
        return throwError(() => e);
      }),
      finalize(() => {
        this.logger.res(incomingMessage.method, incomingMessage?.originalUrl);
      }),
    );
  }
}
