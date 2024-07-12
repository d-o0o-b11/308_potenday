import { Test, TestingModule } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';
import { User } from '../../../domain/user';
import { UserCreateEvent } from '../../../domain/user-create.event';
import {
  CreateFactoryUserDto,
  ReconstituteArrayUserFactoryDto,
} from '../../../interface';
import { UserFactory } from '../../../domain';

describe('UserFactory', () => {
  let factory: UserFactory;
  let eventBus: EventBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserFactory,
        {
          provide: EventBus,
          useValue: { publish: jest.fn() },
        },
      ],
    }).compile();

    factory = module.get<UserFactory>(UserFactory);
    eventBus = module.get<EventBus>(EventBus);
  });

  describe('create', () => {
    it('유저 객체를 생성하고 UserCreateEvent를 발행해야 한다', () => {
      const dto: CreateFactoryUserDto = {
        userId: 1,
        imgId: 1,
        nickName: 'testUser',
        urlId: 1,
      };

      const publish = jest.spyOn(eventBus, 'publish');
      const user = factory.create(dto);

      expect(user).toBeInstanceOf(User);
      expect(user.getId()).toBe(dto.userId);
      expect(user.getImgId()).toBe(dto.imgId);
      expect(user.getNickName()).toBe(dto.nickName);
      expect(user.getUrlId()).toBe(dto.urlId);
      expect(publish).toHaveBeenCalledWith(
        new UserCreateEvent(user.getUrlId()),
      );
    });
  });

  describe('reconstituteArray', () => {
    it('유저 객체를 재구성해야 한다', () => {
      const dto: ReconstituteArrayUserFactoryDto = {
        id: 1,
        imgId: 1,
        nickName: 'testUser',
        urlId: 1,
      };

      const user = factory.reconstituteArray(dto);

      expect(user).toBeInstanceOf(User);
      expect(user.getId()).toBe(dto.id);
      expect(user.getImgId()).toBe(dto.imgId);
      expect(user.getNickName()).toBe(dto.nickName);
      expect(user.getUrlId()).toBe(dto.urlId);
    });
  });
});
