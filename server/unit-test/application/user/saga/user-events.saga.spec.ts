import { Test, TestingModule } from '@nestjs/testing';
import { Observable, of } from 'rxjs';
import { ICommand } from '@nestjs/cqrs';
import { CreateUserEvent, CreateUserReadCommand, UserSaga } from '@application';

describe('UserSaga', () => {
  let saga: UserSaga;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserSaga],
    }).compile();

    saga = module.get<UserSaga>(UserSaga);
  });

  it('IsDefined', () => {
    expect(saga).toBeDefined();
  });

  describe('handleCreateUserEvent', () => {
    it('CreateUserEvent 이벤트가 발행될 경우 CreateUserReadCommand를 실행시킵니다.ㄴ', (done) => {
      const event = new CreateUserEvent(
        126,
        4,
        'd_o0o_b',
        111,
        new Date(Date.now()),
        null,
        null,
      );

      const events$: Observable<CreateUserEvent> = of(event);

      const result = saga.handleCreateUserEvent(events$);

      result.subscribe((command: ICommand) => {
        expect(command).toBeInstanceOf(CreateUserReadCommand);
        expect(command).toEqual(
          new CreateUserReadCommand(
            event.userId,
            event.imgId,
            event.name,
            event.urlId,
            event.createdAt,
            event.updatedAt,
            event.deletedAt,
          ),
        );
        done();
      });
    });
  });
});
