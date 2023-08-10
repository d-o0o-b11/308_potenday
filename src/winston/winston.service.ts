import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { utilities } from 'nest-winston';
import * as winston from 'winston';
import { ExceptionIntf } from './exception.interface';

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      // 원하는 로그 설정

      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === 'dev' ? 'info' : 'silly',
          format: winston.format.combine(
            winston.format.timestamp({
              format: 'YYYY-MM-DD hh:mm:ss A',
            }),
            utilities.format.nestLike('RUWITY_', {
              prettyPrint: true,
            }),
          ),
        }),
        // 다른 원하는 트랜스포트를 추가할 수 있습니다 (파일, HTTP 등)
      ],
    });
  }
  /**
   * @name 요청_객체_로거
   * @param method context.method (GET, POST ...)
   * @param url context.url
   */
  req(method: string, url: string) {
    this.logger.info('-> IN  : ' + method + ' ' + url);
  }

  /**
   * @name 응답_객체_로거
   * @param method context.method (GET, POST ...)
   * @param url context.url
   */
  res(method: string, url: string) {
    this.logger.info('<- OUT : ' + method + ' ' + url);
  }

  log(message: string) {
    this.logger.info(message);
  }

  //   error(message: string, trace: string) {
  //     this.logger.error(message, trace);
  //   }
  error<T>(message: string, exception: ExceptionIntf<T>) {
    this.logger.error(message, exception);
  }

  warn(message: string) {
    this.logger.warning(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }
  // 원하는 다른 로그 메소드를 추가
}
