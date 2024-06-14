import { Repository } from 'typeorm';
import { MbtiPredictionService } from '../service/mbti-prediction.service';
import { MbtiChooseEntity } from '../entities/mbti-choose.entity';
import { UserUrlService } from 'src/user-url/user-url.service';
import { AdjectiveExpressionService } from '../service/adjective-expression.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockRepository } from 'src/mock/mock.repository';
import { GameKindMapper } from '../mapper/game-kind.mapper';

describe('MbtiPredictionService', () => {
  let service: MbtiPredictionService;
  let mbtiChooseEntityRepository: Repository<MbtiChooseEntity>;
  let userUrlService: UserUrlService;
  let adjectiveExpressionService: AdjectiveExpressionService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MbtiPredictionService,
        {
          provide: getRepositoryToken(MbtiChooseEntity),
          useValue: mockRepository(),
        },
        {
          provide: UserUrlService,
          useValue: {
            findUserInfo: jest.fn(),
            findUrlId: jest.fn(),
            saveUserMbti: jest.fn(),
            findOneUserInfo: jest.fn(),
            findUserToUrlOrder: jest.fn(),
          },
        },
        {
          provide: AdjectiveExpressionService,
          useValue: {
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

    service = module.get<MbtiPredictionService>(MbtiPredictionService);
    mbtiChooseEntityRepository = module.get<Repository<MbtiChooseEntity>>(
      getRepositoryToken(MbtiChooseEntity),
    );
    userUrlService = module.get<UserUrlService>(UserUrlService);
    adjectiveExpressionService = module.get<AdjectiveExpressionService>(
      AdjectiveExpressionService,
    );
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(mbtiChooseEntityRepository).toBeDefined();
    expect(userUrlService).toBeDefined();
    expect(adjectiveExpressionService).toBeDefined();
    expect(eventEmitter).toBeDefined();
  });

  describe('getMbtiRound', () => {
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

    const findMbtiRoundDto = {
      url: 'aaaa',
      round_id: 1,
    } as any;

    it('해당 라운드 유저의 mbti 맞추는 함수', async () => {
      const findResult = jest
        .spyOn(userUrlService, 'findUserInfo')
        .mockResolvedValue(findUserInfoDummyData);

      await service.getMbtiRound(findMbtiRoundDto);

      expect(findResult).toBeCalledTimes(1);
      expect(findResult).toBeCalledWith(findMbtiRoundDto.url);
    });
  });

  describe('saveUserMbti', () => {
    const findUrlIdDummyData = {
      id: 11,
      url: 'aaaa',
    } as any;

    const saveMbtiRoundDto = {
      url: 'aaaa',
      user_id: 10,
      round_id: 2,
      mbti: 'ISTJ',
      to_user_id: 5,
    } as any;

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
          mbti: 'ISTJ',
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
          mbti: null,
        },
      ],
    } as any;

    const findOneUserInfoDummyData = {
      round_id: 1,
      id: 10,
      url_id: 11,
      img_id: 4,
      nickname: 'TEST1',
      mbti: 'ISTJ',
    } as any;

    const findOtherResultDummyData = [
      {
        round_id: 1,
        id: 1,
        url_id: 11,
        user_id: 12,
        mbti: 'ENTJ',
        to_user_id: 5,
      },
    ] as any;

    const saveMbtiDto = {
      url_id: findUrlIdDummyData.id,
      user_id: saveMbtiRoundDto.user_id,
      mbti: saveMbtiRoundDto.mbti,
      to_user_id: saveMbtiRoundDto.to_user_id,
    } as any;

    it('해당 라운드 다른 참가자 mbti 맞추기', async () => {
      const findResult = jest
        .spyOn(userUrlService, 'findUrlId')
        .mockResolvedValue(findUrlIdDummyData);

      const saveUserMbti = GameKindMapper.toUserMbtiEntity(saveMbtiDto);

      const saveUserMbtiRepo = jest.spyOn(mbtiChooseEntityRepository, 'save');

      const findUrlUser = jest
        .spyOn(userUrlService, 'findUserInfo')
        .mockResolvedValueOnce(findUserInfoDummyData)
        .mockResolvedValueOnce(findUserInfoDummyData);

      const findOtherResultCount = jest
        .spyOn(mbtiChooseEntityRepository, 'find')
        .mockResolvedValue(findOtherResultDummyData);

      const findOneUserInfoCount = jest
        .spyOn(userUrlService, 'findOneUserInfo')
        .mockResolvedValue(findOneUserInfoDummyData);

      await service.saveUserMbti(saveMbtiRoundDto);

      expect(findResult).toBeCalledTimes(1);
      expect(findResult).toBeCalledWith(saveMbtiRoundDto.url);

      expect(saveUserMbtiRepo).toBeCalledTimes(1);
      expect(saveUserMbtiRepo).toBeCalledWith(saveUserMbti);

      expect(findUrlUser).toBeCalledTimes(2);
      expect(findUrlUser).toHaveBeenNthCalledWith(1, saveMbtiRoundDto.url);
      expect(findUrlUser).toHaveBeenNthCalledWith(2, saveMbtiRoundDto.url);

      expect(findOtherResultCount).toBeCalledTimes(1);
      expect(findOtherResultCount).toBeCalledWith({
        where: {
          url_id: findUserInfoDummyData.id,
          to_user_id:
            findUserInfoDummyData.user[saveMbtiRoundDto.round_id - 1].id,
        },
      });

      expect(findOneUserInfoCount).toBeCalledTimes(2);
      expect(findOneUserInfoCount).toHaveBeenNthCalledWith(
        1,
        findOtherResultDummyData[0].user_id,
      );
    });
  });

  describe('getResultMbtiRound', () => {
    const findResultDummyData = {
      id: 1,
      url: 'aaaa',
      user: [
        {
          id: 10,
          nickname: 'test1',
          img_id: 1,
        },
        {
          id: 11,
          nickname: 'test2',
          img_id: 2,
        },
        {
          id: 12,
          nickname: 'test3',
          img_id: 3,
        },
      ],
    } as any;

    const findUserInfoDummyData = {
      id: 10,
      mbti: 'ISTJ',
      nickname: 'test1',
      img_id: 1,
    } as any;

    const findUserInfoDummyDataOne = {
      id: 11,
      mbti: null,
      nickname: 'test2',
      img_id: 1,
    } as any;

    const findUserInfoDummyDataTwo = {
      id: 12,
      mbti: null,
      nickname: 'test3',
      img_id: 3,
    } as any;

    const findUserInfoDummyDataThird = {
      id: 13,
      mbti: null,
      nickname: 'test4',
      img_id: 4,
    } as any;

    const findOtherResultDummyData = [
      {
        id: 10,
        mbti: 'ENTP',
      },
      {
        id: 11,
        mbti: 'ENTJ',
      },
      {
        id: 12,
        mbti: 'ENTJ',
      },
    ] as any;

    const FindMbtiRoundDto = {
      url: 'aaaa',
      round_id: 1,
    } as any;

    it('해당 라운드 mbti 선택 결과 출력', async () => {
      const findResult = jest
        .spyOn(userUrlService, 'findUserInfo')
        .mockResolvedValue(findResultDummyData);

      const finduserInfo = jest
        .spyOn(userUrlService, 'findOneUserInfo')
        .mockResolvedValueOnce(findUserInfoDummyData)
        .mockResolvedValueOnce(findUserInfoDummyDataOne) // 두 번째 호출
        .mockResolvedValueOnce(findUserInfoDummyDataTwo) // 세 번째 호출
        .mockResolvedValueOnce(findUserInfoDummyDataThird);

      const findOtherResult = jest
        .spyOn(mbtiChooseEntityRepository, 'find')
        .mockResolvedValue(findOtherResultDummyData);

      await service.getResultMbtiRound(FindMbtiRoundDto);

      expect(findResult).toBeCalledTimes(1);
      expect(findResult).toBeCalledWith(FindMbtiRoundDto.url);

      expect(finduserInfo).toBeCalledTimes(4); // 호출 횟수 조정
      expect(finduserInfo).toHaveBeenNthCalledWith(
        1,
        findResultDummyData.user[FindMbtiRoundDto.round_id - 1].id,
      );
      // expect(finduserInfo).toHaveBeenNthCalledWith(
      //   2,
      //   findOtherResultDummyData[0].id,
      // );
      // expect(finduserInfo).toHaveBeenNthCalledWith(
      //   3,
      //   findOtherResultDummyData[1].id, // 세 번째 호출
      // );

      expect(findOtherResult).toBeCalledTimes(1);
      expect(findOtherResult).toBeCalledWith({
        where: {
          url_id: findResultDummyData.id,
          to_user_id:
            findResultDummyData.user[FindMbtiRoundDto.round_id - 1].id,
        },
        order: {
          created_at: 'ASC',
        },
      });
    });
  });

  describe('finalAllUserData', () => {
    const findUserAdjectiveExpressioListDummyData = [
      {
        img_id: 1,
        nickname: 'test1',
        expressions: ['조용한', '엉뚱한'],
      },
      {
        img_id: 3,
        nickname: 'test2',
        expressions: ['조용한', '엉뚱한'],
      },
    ] as any;

    const findUserInfoDummyData = {
      id: 1,
      url: 'aaaa',
      status: false,
      user: [
        {
          id: 1,
          nickname: 'test1',
          mbti: 'ISTJ',
        },
        {
          id: 2,
          nickname: 'test1',
          mbti: 'ENTJ',
        },
      ],
    } as any;

    const url = 'aaaa';

    it('모든 게임 결과 출력', async () => {
      const adjective = jest
        .spyOn(adjectiveExpressionService, 'findUserAdjectiveExpressioList')
        .mockResolvedValue(findUserAdjectiveExpressioListDummyData);

      const findUserInfo = jest
        .spyOn(userUrlService, 'findUserToUrlOrder')
        .mockResolvedValue(findUserInfoDummyData);

      await service.finalAllUserData(url);

      expect(adjective).toBeCalledTimes(1);
      expect(adjective).toBeCalledWith(url, true);

      expect(findUserInfo).toBeCalledTimes(1);
      expect(findUserInfo).toBeCalledWith(url);
    });
  });
});
