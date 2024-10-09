import {
  GameNextEvent,
  NextCommonQuestionCommand,
  NextCommonQuestionCommandHandler,
} from '@application';
import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

describe('NextCommonQuestionCommandHandler', () => {
  let handler: NextCommonQuestionCommandHandler;
  let eventBus: EventBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NextCommonQuestionCommandHandler,
        {
          provide: EventBus,
          useValue: {
            publish: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<NextCommonQuestionCommandHandler>(
      NextCommonQuestionCommandHandler,
    );
    eventBus = module.get<EventBus>(EventBus);
  });

  it('IsDefined', () => {
    expect(handler).toBeDefined();
    expect(eventBus).toBeDefined();
  });

  describe('execute', () => {
    const command = new NextCommonQuestionCommand(111);

    it('GameNextEvent 이벤트를 발행하여 다음 질문으로 넘어갑니다.', async () => {
      const publish = jest.spyOn(eventBus, 'publish');

      await handler.execute(command);

      expect(publish).toBeCalledTimes(1);
      expect(publish).toBeCalledWith(
        new GameNextEvent(
          'CommonQuestionGameNextEvent',
          'event',
          command.urlId,
        ),
      );
    });
  });
});
