import { Test, TestingModule } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';
import { StatusUpdatedEvent } from '@user/domain';
import { UserUrlEventPublisher } from '../../../application';
import { UpdateUserUrlFactoryDto } from '@user/interface';

describe('UserUrlEventPublisher', () => {
  let eventPublisher: UserUrlEventPublisher;
  let eventBus: EventBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserUrlEventPublisher,
        {
          provide: EventBus,
          useValue: {
            publish: jest.fn(),
          },
        },
      ],
    }).compile();

    eventPublisher = module.get<UserUrlEventPublisher>(UserUrlEventPublisher);
    eventBus = module.get<EventBus>(EventBus);
  });

  describe('updateStatus', () => {
    it('StatusUpdatedEvent를 올바르게 발행해야 합니다.', () => {
      const dto: UpdateUserUrlFactoryDto = {
        urlId: 1,
        status: true,
      };

      const publish = jest.spyOn(eventBus, 'publish');

      eventPublisher.updateStatus(dto);

      expect(publish).toHaveBeenCalledWith(
        new StatusUpdatedEvent(dto.urlId, dto.status),
      );
    });
  });
});
