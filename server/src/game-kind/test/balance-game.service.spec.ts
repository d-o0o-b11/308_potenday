import { Repository } from 'typeorm';
import { BalanceGameService } from '../service/balance-game.service';
import { UserBalanceGameEntity } from '../entities/user-balance-game.entity';
import { BalanceGameEntity } from '../entities/balance-game-list.entity';
import { UserUrlService } from 'src/user-url/user-url.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockRepository } from 'src/mock/mock.repository';
import { GameKindMapper } from '../mapper/game-kind.mapper';

describe('BalanceGameService', () => {
  let service: BalanceGameService;
  let userBalanceGameRepository: Repository<UserBalanceGameEntity>;
  let balanceGameRepository: Repository<BalanceGameEntity>;
  let userUrlService: UserUrlService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BalanceGameService,
        {
          provide: getRepositoryToken(UserBalanceGameEntity),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(BalanceGameEntity),
          useValue: mockRepository(),
        },
        {
          provide: UserUrlService,
          useValue: {
            findUrlId: jest.fn(),
            findUserInfoWithBalance: jest.fn(),
            findUserInfo: jest.fn(),
          },
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BalanceGameService>(BalanceGameService);
    userBalanceGameRepository = module.get<Repository<UserBalanceGameEntity>>(
      getRepositoryToken(UserBalanceGameEntity),
    );
    balanceGameRepository = module.get<Repository<BalanceGameEntity>>(
      getRepositoryToken(BalanceGameEntity),
    );
    userUrlService = module.get<UserUrlService>(UserUrlService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userBalanceGameRepository).toBeDefined();
    expect(balanceGameRepository).toBeDefined();
    expect(userUrlService).toBeDefined();
    expect(eventEmitter).toBeDefined();
  });

  describe('getBalanceGame', () => {
    const findOneResueltDummyData = {
      id: 1,
      type_A: 'TEST_TYPE_A',
      type_B: 'TEST_TYPE_B',
    } as any;

    const balance_id = 1;

    it('각 라운드 밸런스 게인 질문지 출력', async () => {
      const findOneResuelt = jest
        .spyOn(balanceGameRepository, 'findOne')
        .mockResolvedValue(findOneResueltDummyData);

      await service.getBalanceGame(balance_id);

      expect(findOneResuelt).toBeCalledTimes(1);
      expect(findOneResuelt).toBeCalledWith({
        where: {
          id: balance_id,
        },
      });
    });
  });

  describe('saveBalanceGame', () => {
    const findUrlIdDummyData = {
      id: 11,
      url: 'aaaa',
      status: false,
      created_at: new Date('2023-09-07'),
    } as any;

    const saveUserBalanceGameDummyData = {
      id: 1,
      url_id: 11,
      user_id: 10,
      balance_type: 'TEST_TYPE_A',
      created_at: new Date('2023-09-07'),
    } as any;

    const findUserInfoWithBalanceDummyData = [
      {
        id: 1,
        url_id: 11,
        status: false,
        created_at: new Date('2023-09-07'),
        user: [
          {
            id: 10,
            url_id: 11,
            img_id: 4,
            nickname: 'TEST1',
            balance: [
              {
                id: 1,
                url_id: 11,
                user_id: 10,
                balance_type: 'TEST_TYPE_A',
                balance_id: 1,
                created_at: new Date('2023-09-06'),
              },
            ],
          },
          {
            id: 12,
            url_id: 11,
            img_id: 4,
            nickname: 'TEST2',
            balance: [
              {
                id: 2,
                url_id: 11,
                user_id: 12,
                balance_type: 'TEST_TYPE_B',
                balance_id: 1,
                created_at: new Date('2023-09-07'),
              },
            ],
          },
        ],
      },
    ] as any;

    const findUserInfoDummyData = {
      id: 11,
      url: 'aaaa',
      status: false,
      created_at: new Date('2023-09-07'),
      user: [
        {
          id: 10,
          url_id: 11,
          img_id: 4,
          nickname: 'TEST1',
          balance: [
            {
              id: 1,
              url_id: 11,
              user_id: 10,
              balance_type: 'TEST_TYPE_A',
              balance_id: 1,
              created_at: new Date('2023-09-06'),
            },
          ],
        },
        {
          id: 12,
          url_id: 11,
          img_id: 4,
          nickname: 'TEST2',
          balance: [
            {
              id: 2,
              url_id: 11,
              user_id: 12,
              balance_type: 'TEST_TYPE_B',
              balance_id: 1,
              created_at: new Date('2023-09-07'),
            },
          ],
        },
      ],
    } as any;

    const createBalanceGameDto = {
      url: 'aaaa',
      balance_id: 1,
      user_id: 11,
      type: 'TEST_TYPE_A',
    } as any;

    it('밸런스 게임 투표', async () => {
      const findResult = jest
        .spyOn(userUrlService, 'findUrlId')
        .mockResolvedValue(findUrlIdDummyData);

      const saveUserBalanceGame = GameKindMapper.toBalanceGameEntity({
        url_id: findUrlIdDummyData.id,
        user_id: createBalanceGameDto.user_id,
        balance_id: createBalanceGameDto.balance_id,
        balance_type: createBalanceGameDto.type,
      });

      const saveResult = jest
        .spyOn(userBalanceGameRepository, 'save')
        .mockResolvedValue(saveUserBalanceGameDummyData);

      const findUserCountResult = jest
        .spyOn(userUrlService, 'findUserInfoWithBalance')
        .mockResolvedValue(findUserInfoWithBalanceDummyData);

      const findUserCountUser = jest
        .spyOn(userUrlService, 'findUserInfo')
        .mockResolvedValue(findUserInfoDummyData);

      await service.saveBalanceGame(createBalanceGameDto);

      expect(findResult).toBeCalledTimes(1);
      expect(findResult).toBeCalledWith(createBalanceGameDto.url);

      expect(saveResult).toBeCalledTimes(1);
      expect(saveResult).toBeCalledWith(saveUserBalanceGame);

      expect(findUserCountResult).toBeCalledTimes(1);
      expect(findUserCountResult).toBeCalledWith(createBalanceGameDto.url);

      expect(findUserCountUser).toBeCalledTimes(1);
      expect(findUserCountUser).toBeCalledWith(createBalanceGameDto.url);
    });
  });

  describe('findBalanceGameUser', () => {
    const findUserInfoWithBalanceDummyData = [
      {
        id: 1,
        url_id: 11,
        status: false,
        created_at: new Date('2023-09-07'),
        user: [
          {
            id: 10,
            url_id: 11,
            img_id: 4,
            nickname: 'TEST1',
            balance: [
              {
                id: 1,
                url_id: 11,
                user_id: 10,
                balance_type: 'TEST_TYPE_A',
                balance_id: 1,
                created_at: new Date('2023-09-06'),
              },
            ],
          },
          {
            id: 12,
            url_id: 11,
            img_id: 4,
            nickname: 'TEST2',
            balance: [
              {
                id: 2,
                url_id: 11,
                user_id: 12,
                balance_type: 'TEST_TYPE_B',
                balance_id: 1,
                created_at: new Date('2023-09-07'),
              },
            ],
          },
        ],
      },
    ] as any;

    const percentagesResult = {
      percent: ['TEST_TYPE_A: 50%', 'TEST_TYPE_B: 50%'],
      user: [
        {
          balance_type: 'TEST_TYPE_A',
          img_id: 4,
          nickname: 'TEST1',
          url_id: 11,
        },
        {
          balance_type: 'TEST_TYPE_B',
          img_id: 4,
          nickname: 'TEST2',
          url_id: 11,
        },
      ],
    } as any;

    const findBalanceGameDto = {
      url: 'aaaa',
      balance_id: 1,
    } as any;

    const getBalanceTypeDummyData = {
      id: 1,
      type_A: 'TEST_TYPE_A',
      type_B: 'TEST_TYPE_B',
    } as any;

    it('각 밸런스 비율 출력', async () => {
      const findResult = jest
        .spyOn(userUrlService, 'findUserInfoWithBalance')
        .mockResolvedValue(findUserInfoWithBalanceDummyData);

      const getBalanceGame = jest
        .spyOn(service, 'getBalanceGame')
        .mockResolvedValue(getBalanceTypeDummyData);

      const result = await service.findBalanceGameUser(findBalanceGameDto);

      expect(findResult).toBeCalledTimes(1);
      expect(findResult).toBeCalledWith(findBalanceGameDto.url);

      expect(getBalanceGame).toBeCalledTimes(1);
      expect(getBalanceGame).toBeCalledWith(findBalanceGameDto.balance_id);

      expect(result).toEqual(percentagesResult);
    });
  });
});
