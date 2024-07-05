import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Scope,
} from '@nestjs/common';
// import { Observable } from "rxjs";
import { catchError, Observable, throwError, finalize } from 'rxjs';
import { LoggerService } from './winston.service';

@Injectable({ scope: Scope.REQUEST })
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, originalUrl } = req;

    this.logger.req(method, originalUrl);

    return next.handle().pipe(
      catchError((e) => {
        const { message, ...meta } = e;
        this.logger.error(`Error on ${originalUrl}`, { message, ...meta });

        return throwError(() => e);
      }),
      finalize(() => {
        const res = context.switchToHttp().getResponse();
        this.logger.res(method, originalUrl);
      }),
    );
  }
}
