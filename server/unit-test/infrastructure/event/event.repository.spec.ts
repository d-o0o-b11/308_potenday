import { EventEntity, EventRepository } from '@infrastructure';
import { MockEntityManager } from '@mock';
import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';

describe('EventRepository', () => {
  let repository: EventRepository;
  let manager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventRepository],
    }).compile();

    repository = module.get<EventRepository>(EventRepository);
    manager = MockEntityManager();
  });

  it('IsDefined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    const event = {
      eventType: 'create',
      eventMethod: 'create',
      id: 111,
    };
    it('이벤트를 저장합니다.', async () => {
      const save = jest.spyOn(manager, 'save');
      const { eventType, eventMethod, ...rest } = event;

      await repository.create(event, manager);

      expect(save).toBeCalledTimes(1);
      expect(save).toBeCalledWith(
        new EventEntity({
          type: eventType,
          method: eventMethod,
          event: rest,
        }),
      );
    });
  });
});
