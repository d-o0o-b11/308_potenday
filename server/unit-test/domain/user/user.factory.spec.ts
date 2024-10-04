import { Test, TestingModule } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';
import { CreateFactoryUserDto, CreateUserReadDto } from '@application';
import {
  BALANCE_TYPES,
  CreateUserInfoEvent,
  User,
  UserFactory,
  UserRead,
} from '@domain';

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

  it('IsDefined', () => {
    expect(factory).toBeDefined();
  });

  describe('create', () => {
    it('CreateUserInfoEvent 이벤트를 발행하며, User 객체를 반환합니다.', () => {
      const dto: CreateFactoryUserDto = {
        userId: 1,
        imgId: 2,
        name: 'd_o0o_b',
        urlId: 126,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const user = factory.create(dto);

      expect(user).toBeInstanceOf(User);
      expect(user.getUrlId()).toBe(dto.urlId);
      expect(eventBus.publish).toHaveBeenCalledWith(
        new CreateUserInfoEvent(user.getUrlId()),
      );
    });
  });

  describe('reconstituteRead', () => {
    it('UserRead 객체를 반환합니다.', () => {
      const dto: CreateUserReadDto = {
        userId: 1,
        imgId: 2,
        name: 'd_o0o_b',
        urlId: 126,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        balance: [
          {
            balanceId: 1,
            balanceType: BALANCE_TYPES.A,
            createdAt: '2024-09-16',
          },
        ],
        mbti: [
          {
            mbtiId: 111,
            mbti: 'ISTJ',
            toUserId: 127,
            createdAt: '2024-09-15',
          },
        ],
        adjectiveExpression: {
          adjectiveExpressionIdList: [1, 4, 11],
          createdAt: '2024-09-16',
        },
      };

      const userRead = factory.reconstituteRead(dto);

      expect(userRead).toBeInstanceOf(UserRead);
      expect(userRead.getUserId()).toBe(dto.userId);
      expect(userRead.getImgId()).toBe(dto.imgId);
      expect(userRead.getName()).toBe(dto.name);
      expect(userRead.getUrlId()).toBe(dto.urlId);
      expect(userRead.getCreatedAt()).toBe(dto.createdAt);
      expect(userRead.getUpdatedAt()).toBe(dto.updatedAt);
      expect(userRead.getBalance()).toBe(dto.balance);
      expect(userRead.getMbti()).toBe(dto.mbti);
      expect(userRead.getAdjectiveExpressions()).toEqual(
        dto.adjectiveExpression,
      );
    });
  });
});
