import { Test, TestingModule } from '@nestjs/testing';
import { AdjectiveExpressionService } from '../service/adjective-expression.service';
import { Repository } from 'typeorm';
import { AdjectiveExpressionEntity } from '../entities/adjective-expression.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockRepository } from 'src/mock/mock.repository';
import { UserAdjectiveExpressionEntity } from '../entities/user-adjective-expression.entity';
import { UserUrlService } from 'src/user-url/user-url.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GameKindMapper } from '../mapper/game-kind.mapper';

describe('AdjectiveExpressionService', () => {
  let service: AdjectiveExpressionService;
  let adjectiveExpressionRepository: Repository<AdjectiveExpressionEntity>;
  let userAdjectiveExpressionRepository: Repository<UserAdjectiveExpressionEntity>;
  let userUrlService: UserUrlService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdjectiveExpressionService,
        {
          provide: getRepositoryToken(AdjectiveExpressionEntity),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(UserAdjectiveExpressionEntity),
          useValue: mockRepository(),
        },
        {
          provide: UserUrlService,
          useValue: {
            countUserAdjectiveExpression: jest.fn(),
            countUserToWaitingRoom: jest.fn(),
            findUserAdjectiveExpressioListOrder: jest.fn(),
            findUserAdjectiveExpressioList: jest.fn(),
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

    service = module.get<AdjectiveExpressionService>(
      AdjectiveExpressionService,
    );
    adjectiveExpressionRepository = module.get<
      Repository<AdjectiveExpressionEntity>
    >(getRepositoryToken(AdjectiveExpressionEntity));
    userAdjectiveExpressionRepository = module.get<
      Repository<UserAdjectiveExpressionEntity>
    >(getRepositoryToken(UserAdjectiveExpressionEntity));
    userUrlService = module.get<UserUrlService>(UserUrlService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(adjectiveExpressionRepository).toBeDefined();
    expect(userAdjectiveExpressionRepository).toBeDefined();
    expect(userUrlService).toBeDefined();
    expect(eventEmitter).toBeDefined();
  });

  describe('getAllExpressionList', () => {
    const findResultDummyData = [
      {
        id: 1,
        expression: '차분함',
      },
      {
        id: 2,
        expression: '적극적',
      },
    ] as any;

    it('모든 형용사 항목 출력', async () => {
      const findResult = jest
        .spyOn(adjectiveExpressionRepository, 'find')
        .mockResolvedValue(findResultDummyData);

      await service.getAllExpressionList();

      expect(findResult).toBeCalledTimes(1);
      expect(findResult).toBeCalledWith({
        order: {
          id: 'ASC',
        },
      });
    });
  });

  describe('saveUserExpressionList', () => {
    const createGameKindDto = {
      url: 'TEST_URL',
      user_id: 12,
      expression_id: [5],
    } as any;

    const createGameKindOneDto = {
      url: 'TEST_URL',
      user_id: 12,
      expression_id: 5,
    } as any;

    const saveResultDummyData = [
      {
        id: 1,
        user_id: 12,
        expression_id: 5,
      },
    ] as any;

    it('형용사 표현 저장 (최대4개)', async () => {
      const userAdjectiveExpression =
        GameKindMapper.toUserAdjectiveExpressionEntity(
          createGameKindOneDto.user_id,
          createGameKindOneDto.expression_id,
        );

      const saveResult = jest
        .spyOn(userAdjectiveExpressionRepository, 'save')
        .mockResolvedValue(saveResultDummyData);

      const expressionListFindResult = jest
        .spyOn(userUrlService, 'countUserAdjectiveExpression')
        .mockResolvedValue(2);

      const expressionListFindCountUser = jest
        .spyOn(userUrlService, 'countUserToWaitingRoom')
        .mockResolvedValue({
          userCount: 1,
          userInfo: [
            {
              id: 1,
              url_id: 1,
              img_id: 3,
              nickname: 'test1',
            } as any,
          ],
        });

      await service.saveUserExpressionList(createGameKindDto);

      expect(saveResult).toBeCalledTimes(1);
      expect(saveResult).toBeCalledWith([userAdjectiveExpression]);

      expect(expressionListFindResult).toBeCalledTimes(1);
      expect(expressionListFindResult).toBeCalledWith(createGameKindDto.url);

      expect(expressionListFindCountUser).toBeCalledTimes(1);
      expect(expressionListFindCountUser).toBeCalledWith(createGameKindDto.url);
    });
  });

  describe('findUserAdjectiveExpressioList', () => {
    const url = 'TEST_URL';
    const findResultOrderDummyData = {
      id: 1,
      url: 'TEST_URL',
      status: false,
      created_at: new Date('2023-09-06'),
      user: [
        {
          id: 1,
          url_id: 12,
          img_id: 1,
          nickname: 'test1',
          expressions: [
            {
              id: 1,
              user_id: 1,
              expression_id: 5,
              expressions: {
                id: 5,
                expression: '강인함',
              },
            },
          ],
        },
      ],
    } as any;

    it('사용자가 선택한 형용사 출력(정렬)', async () => {
      const findResult = jest
        .spyOn(userUrlService, 'findUserAdjectiveExpressioListOrder')
        .mockResolvedValue(findResultOrderDummyData);

      const result = await service.findUserAdjectiveExpressioList(url, true);

      expect(findResult).toBeCalledTimes(1);
      expect(findResult).toBeCalledWith(url);

      expect(result).toEqual([
        {
          img_id: findResultOrderDummyData.user[0].img_id,
          nickname: findResultOrderDummyData.user[0].nickname,
          expressions: ['강인함'],
        },
      ] as any);
    });

    it('사용자가 선택한 형용사 (비정렬)', async () => {
      const findResult = jest
        .spyOn(userUrlService, 'findUserAdjectiveExpressioList')
        .mockResolvedValue(findResultOrderDummyData);

      const result = await service.findUserAdjectiveExpressioList(url);

      expect(findResult).toBeCalledTimes(1);
      expect(findResult).toBeCalledWith(url);

      expect(result).toEqual([
        {
          img_id: findResultOrderDummyData.user[0].img_id,
          nickname: findResultOrderDummyData.user[0].nickname,
          expressions: ['강인함'],
        },
      ] as any);
    });
  });
});
