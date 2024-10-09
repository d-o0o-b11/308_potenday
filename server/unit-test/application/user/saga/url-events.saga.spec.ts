import { Test, TestingModule } from '@nestjs/testing';
import { Observable, of } from 'rxjs';
import { ICommand } from '@nestjs/cqrs';
import {
  CreateUrlEvent,
  CreateUrlReadCommand,
  UpdateUrlReadStatusCommand,
  UpdateUrlStatusEvent,
  UrlSaga,
} from '@application';

describe('UrlSaga', () => {
  let saga: UrlSaga;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlSaga],
    }).compile();

    saga = module.get<UrlSaga>(UrlSaga);
  });

  it('IsDefined', () => {
    expect(saga).toBeDefined();
  });

  describe('handleCreateUrlEvent', () => {
    it('CreateUrlEvent 이벤트가 발행될 경우 CreateUrlReadCommand를 실행시킵니다.', (done) => {
      const event = new CreateUrlEvent(
        111,
        'TEST_URL',
        true,
        new Date(Date.now()),
        null,
        null,
      );

      const events$: Observable<CreateUrlEvent> = of(event);

      const result = saga.handleCreateUrlEvent(events$);

      result.subscribe((command: ICommand) => {
        expect(command).toBeInstanceOf(CreateUrlReadCommand);
        expect(command).toEqual(
          new CreateUrlReadCommand(
            event.urlId,
            event.url,
            event.status,
            event.createdAt,
            event.updatedAt,
            event.deletedAt,
          ),
        );
        done();
      });
    });
  });

  describe('handleUpdateUrlStatusEvent', () => {
    it('UpdateUrlStatusEvent 이벤트가 발행될 경우 UpdateUrlReadStatusCommand를 실행시킵니다.', (done) => {
      const event = new UpdateUrlStatusEvent(111, true);

      const events$: Observable<UpdateUrlStatusEvent> = of(event);

      const result = saga.handleUpdateUrlStatusEvent(events$);

      result.subscribe((command: ICommand) => {
        expect(command).toBeInstanceOf(UpdateUrlReadStatusCommand);
        expect(command).toEqual(
          new UpdateUrlReadStatusCommand(event.urlId, event.status),
        );
        done();
      });
    });
  });
});
