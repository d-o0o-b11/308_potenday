import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import { AllExceptionsFilter, BasicException } from '@common';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  let response: Response;
  let request: Request;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AllExceptionsFilter],
    }).compile();

    filter = module.get<AllExceptionsFilter>(AllExceptionsFilter);
    request = {} as Request;
    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response;
  });

  it('IsDefined', () => {
    expect(filter).toBeDefined();
  });

  it('exception: BasicException', () => {
    const exception = new BasicException(
      'Error message',
      HttpStatus.BAD_REQUEST,
      'ERROR_CODE',
    );

    filter.catch(exception, {
      switchToHttp: () => ({
        getResponse: () => response,
        getRequest: () => request,
      }),
    } as ArgumentsHost);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(response.json).toHaveBeenCalledWith({
      code: 'ERROR_CODE',
      status: HttpStatus.BAD_REQUEST,
      timestamp: expect.any(String),
      path: `${request.method} ${request.url}`,
      message: 'Error message',
    });
  });

  it('exception: HttpException', () => {
    const exception = new HttpException('Error message', HttpStatus.FORBIDDEN);

    filter.catch(exception, {
      switchToHttp: () => ({
        getResponse: () => response,
        getRequest: () => request,
      }),
    } as ArgumentsHost);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
    expect(response.json).toHaveBeenCalledWith({
      code: 'INTERNET_SERVER_ERROR',
      status: HttpStatus.FORBIDDEN,
      timestamp: expect.any(String),
      path: `${request.method} ${request.url}`,
      message: 'Error message',
    });
  });

  it('exception: QueryFailedError', () => {
    const exception = new QueryFailedError(
      'query',
      {} as any,
      new Error('Query failed'),
    );

    filter.catch(exception, {
      switchToHttp: () => ({
        getResponse: () => response,
        getRequest: () => request,
      }),
    } as ArgumentsHost);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(response.json).toHaveBeenCalledWith({
      code: 'QUERY_ERROR',
      status: HttpStatus.BAD_REQUEST,
      timestamp: expect.any(String),
      path: `${request.method} ${request.url}`,
      message: 'Database query failed',
    });
  });

  it('exception: EntityNotFoundError', () => {
    const exception = new EntityNotFoundError('Entity', 'message');

    filter.catch(exception, {
      switchToHttp: () => ({
        getResponse: () => response,
        getRequest: () => request,
      }),
    } as ArgumentsHost);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(response.json).toHaveBeenCalledWith({
      code: 'ENTITY_NOT_FOUND',
      status: HttpStatus.NOT_FOUND,
      timestamp: expect.any(String),
      path: `${request.method} ${request.url}`,
      message: 'Entity not found',
    });
  });

  it('그외 exception', () => {
    const exception = new Error('Unknown error');

    filter.catch(exception, {
      switchToHttp: () => ({
        getResponse: () => response,
        getRequest: () => request,
      }),
    } as ArgumentsHost);

    expect(response.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(response.json).toHaveBeenCalledWith({
      code: 'INTERNAL_SERVER_ERROR',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: expect.any(String),
      path: `${request.method} ${request.url}`,
      message: 'Internal Server Error',
    });
  });
});
