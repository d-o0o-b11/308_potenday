import { Test, TestingModule } from '@nestjs/testing';
import {
  NextStepCommand,
  NextStepHandler,
  UserUrlEventPublisher,
} from '@application';
import { USER_URL_EVENT_PUBLISHER } from '@infrastructure';

describe('NextStepHandler', () => {
  let handler: NextStepHandler;
  let userUrlEventPublisher: UserUrlEventPublisher;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NextStepHandler,
        {
          provide: USER_URL_EVENT_PUBLISHER,
          useValue: {
            updateStatus: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<NextStepHandler>(NextStepHandler);
    userUrlEventPublisher = module.get<UserUrlEventPublisher>(
      USER_URL_EVENT_PUBLISHER,
    );
  });

  describe('execute', () => {
    it('다음 단계로 넘어갑니다, 상태를 업데이트해야 합니다', async () => {
      const command = new NextStepCommand(1);

      const updateStatus = jest.spyOn(userUrlEventPublisher, 'updateStatus');

      await handler.execute(command);

      expect(updateStatus).toHaveBeenCalledWith({
        urlId: 1,
        status: true,
      });
    });
  });
});
