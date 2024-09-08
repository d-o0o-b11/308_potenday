import { Test, TestingModule } from '@nestjs/testing';
import {
  UnhandledExceptionBus,
  UnhandledExceptionInfo,
  IEvent,
} from '@nestjs/cqrs';
import { EventExceptionHandlerService } from '@application';

describe('EventExceptionHandlerService', () => {
  let service: EventExceptionHandlerService;
  let unhandledExceptionsBus: UnhandledExceptionBus;

  beforeEach(async () => {
    unhandledExceptionsBus = {
      pipe: jest.fn().mockReturnValue({
        subscribe: jest.fn().mockImplementation(() => {
          return () => {
            const destroy$ = (service as any).destroy$;
            destroy$.next();
          };
        }),
      }),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventExceptionHandlerService,
        { provide: UnhandledExceptionBus, useValue: unhandledExceptionsBus },
      ],
    }).compile();

    service = module.get<EventExceptionHandlerService>(
      EventExceptionHandlerService,
    );
  });

  it('IsDefined', () => {
    expect(service).toBeDefined();
  });

  it('event 오류가 발생했을 경우 예외 처리 로직을 수행한다.', () => {
    const exceptionInfo: UnhandledExceptionInfo<IEvent> = {
      exception: new Error('Test error'),
      context: {
        message: { type: 'TestEvent' } as IEvent,
        handler: 'TestHandler',
      },
    } as any;

    const callback = (unhandledExceptionsBus.pipe().subscribe as jest.Mock).mock
      .calls[0][0];
    callback(exceptionInfo);
  });

  it('onModuleDestroy 호출하여 연결을 제거한다.', () => {
    const destroy$ = service['destroy$'];
    const completeSpy = jest.spyOn(destroy$, 'complete');
    service.onModuleDestroy();
    expect(completeSpy).toHaveBeenCalledTimes(1);
  });
});
