import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { utilities } from 'nest-winston';
import * as winston from 'winston';
import { ExceptionIntf } from './exception.interface';

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === 'development' ? 'info' : 'silly',
          format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss A' }),
            winston.format.colorize({ all: true }),
            winston.format.printf(({ timestamp, level, message, context }) => {
              return `[${level}] ${timestamp} ${
                context ? `[${context}] ` : ''
              }${message}`;
            }),
          ),
        }),
      ],
    });
  }

  private formatContextMessage(
    method: string,
    url: string,
    direction: string,
  ): string {
    return `${direction} : ${method} ${url}`;
  }

  /**
   * @name 요청_객체_로거
   * @param method context.method (GET, POST ...)
   * @param url context.url
   */
  req(method: string, url: string) {
    this.logger.info(this.formatContextMessage(method, url, '-> IN'));
  }

  /**
   * @name 응답_객체_로거
   * @param method context.method (GET, POST ...)
   * @param url context.url
   */
  res(method: string, url: string) {
    this.logger.info(this.formatContextMessage(method, url, '<- OUT'));
  }

  log(message: string) {
    this.logger.info(message);
  }

  error<T>(message: string, exception: ExceptionIntf<T>) {
    this.logger.error(`${message} - ${JSON.stringify(exception)}`);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }
}
