import {
  UpdateStatusFalseCommand,
  UpdateStatusFalseHandler,
  UpdateUrlStatusEvent,
} from '@application';
import { StatusUpdatedEvent } from '@domain';
import { URL_SERVICE_TOKEN } from '@infrastructure';
import { IUrlService } from '@interface';
import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

describe('UpdateStatusFalseHandler', () => {
  let handler: UpdateStatusFalseHandler;
  let urlService: IUrlService;
  let eventBus: EventBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateStatusFalseHandler,
        {
          provide: URL_SERVICE_TOKEN,
          useValue: {
            updateStatusFalse: jest.fn(),
          },
        },
        {
          provide: EventBus,
          useValue: {
            publish: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<UpdateStatusFalseHandler>(UpdateStatusFalseHandler);
    urlService = module.get<IUrlService>(URL_SERVICE_TOKEN);
    eventBus = module.get<EventBus>(EventBus);
  });

  it('IsDefined', () => {
    expect(handler).toBeDefined();
    expect(urlService).toBeDefined();
    expect(eventBus).toBeDefined();
  });

  describe('execute', () => {
    const command = new UpdateStatusFalseCommand(111);

    it('url status false로 변환합니다.', async () => {
      const updateStatusFalse = jest.spyOn(urlService, 'updateStatusFalse');
      const eventPublish = jest.spyOn(eventBus, 'publish');

      await handler.execute(command);

      expect(updateStatusFalse).toBeCalledTimes(1);
      expect(updateStatusFalse).toBeCalledWith(command.urlId);
      expect(eventPublish).toBeCalledTimes(2);
      expect(eventPublish).toHaveBeenNthCalledWith(
        1,
        new UpdateUrlStatusEvent(command.urlId, false),
      );
      expect(eventPublish).toHaveBeenNthCalledWith(
        2,
        new StatusUpdatedEvent(command.urlId, true),
      );
    });
  });
});
