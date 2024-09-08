import { CreateUrlCommandHandler, CreateUrlEvent } from '@application';
import { URL_SERVICE_TOKEN } from '@infrastructure';
import { IUrlService } from '@interface';
import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

describe('CreateUrlCommandHandler', () => {
  let handler: CreateUrlCommandHandler;
  let urlService: IUrlService;
  let eventBus: EventBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUrlCommandHandler,
        {
          provide: URL_SERVICE_TOKEN,
          useValue: {
            setUrl: jest.fn(),
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

    handler = module.get<CreateUrlCommandHandler>(CreateUrlCommandHandler);
    urlService = module.get<IUrlService>(URL_SERVICE_TOKEN);
    eventBus = module.get<EventBus>(EventBus);
  });

  it('IsDefined', () => {
    expect(handler).toBeDefined();
    expect(urlService).toBeDefined();
    expect(eventBus).toBeDefined();
  });

  describe('execute', () => {
    const urlResult = {
      getId: () => 11,
      getUrl: () => 'TEST_URL',
      getStatus: () => true,
      getCreatedAt: () => new Date('2024-09-01'),
      getUpdatedAt: () => null,
      getDeletedAt: () => null,
    } as any;

    it('url을 발급합니다.', async () => {
      const setUrl = jest
        .spyOn(urlService, 'setUrl')
        .mockResolvedValue(urlResult);
      const eventPublish = jest.spyOn(eventBus, 'publish');

      await handler.execute();

      expect(setUrl).toBeCalledTimes(1);
      expect(setUrl).toBeCalledWith();
      expect(eventPublish).toBeCalledTimes(1);
      expect(eventPublish).toBeCalledWith(
        new CreateUrlEvent(
          urlResult.getId(),
          urlResult.getUrl(),
          urlResult.getStatus(),
          urlResult.getCreatedAt(),
          urlResult.getUpdatedAt(),
          urlResult.getDeletedAt(),
        ),
      );
    });
  });
});
