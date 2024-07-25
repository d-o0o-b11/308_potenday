import { Test, TestingModule } from '@nestjs/testing';
import {
  UpdateStatusFalseCommand,
  UpdateStatusFalseHandler,
  UserUrlEventPublisher,
} from '@application';
import { IUserUrlService } from '@interface';
import {
  USER_URL_EVENT_PUBLISHER,
  USER_URL_SERVICE_TOKEN,
} from '@infrastructure';

describe('UpdateStatusFalseHandler', () => {
  let handler: UpdateStatusFalseHandler;
  let userUrlService: IUserUrlService;
  let userUrlEventPublisher: UserUrlEventPublisher;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateStatusFalseHandler,
        {
          provide: USER_URL_SERVICE_TOKEN,
          useValue: {
            updateStatusFalse: jest.fn(),
          },
        },
        {
          provide: USER_URL_EVENT_PUBLISHER,
          useValue: {
            updateStatus: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<UpdateStatusFalseHandler>(UpdateStatusFalseHandler);
    userUrlService = module.get<IUserUrlService>(USER_URL_SERVICE_TOKEN);
    userUrlEventPublisher = module.get<UserUrlEventPublisher>(
      USER_URL_EVENT_PUBLISHER,
    );
  });

  describe('execute', () => {
    it('해당 url을 입장 불가 상태로 업데이트해야 합니다, 이벤트 상태를 업데이트합니다.', async () => {
      const command = new UpdateStatusFalseCommand(1);

      const updateStatusFalse = jest.spyOn(userUrlService, 'updateStatusFalse');
      const updateStatus = jest.spyOn(userUrlEventPublisher, 'updateStatus');

      await handler.execute(command);

      expect(updateStatusFalse).toHaveBeenCalledWith(1);

      expect(updateStatus).toHaveBeenCalledWith({
        urlId: 1,
        status: true,
      });
    });
  });
});
