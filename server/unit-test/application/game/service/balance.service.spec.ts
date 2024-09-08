import {
  BalanceService,
  CreateUserBalanceDto,
  FindSubmitUserDto,
} from '@application';
import { SubmitBalanceException } from '@common';
import {
  BALANCE_TYPES,
  IBalanceReadRepository,
  IBalanceRepository,
} from '@domain';
import {
  BALANCE_READ_REPOSITORY_TOKEN,
  BALANCE_REPOSITORY_TOKEN,
} from '@infrastructure';
import { MockEntityManager } from '@mock';
import { Test, TestingModule } from '@nestjs/testing';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

describe('BalanceService', () => {
  let service: BalanceService;
  let balanceRepository: IBalanceRepository;
  let balanceReadRepository: IBalanceReadRepository;
  let readManager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BalanceService,
        {
          provide: BALANCE_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: BALANCE_READ_REPOSITORY_TOKEN,
          useValue: {
            isSubmitUser: jest.fn(),
            findUserCount: jest.fn(),
          },
        },
        {
          provide: getEntityManagerToken('read'),
          useValue: MockEntityManager(),
        },
      ],
    }).compile();

    service = module.get<BalanceService>(BalanceService);
    balanceRepository = module.get<IBalanceRepository>(
      BALANCE_REPOSITORY_TOKEN,
    );
    balanceReadRepository = module.get<IBalanceReadRepository>(
      BALANCE_READ_REPOSITORY_TOKEN,
    );
    readManager = module.get<EntityManager>(getEntityManagerToken('read'));
  });

  it('IsDefined', () => {
    expect(service).toBeDefined();
    expect(balanceRepository).toBeDefined();
    expect(balanceReadRepository).toBeDefined();
    expect(readManager).toBeDefined();
  });

  describe('saveUserExpressionAndGetSubmitCount', () => {
    const dto = {
      urlId: 11,
      userId: 126,
      balanceId: 1,
      balanceType: BALANCE_TYPES.A,
    };

    it('밸런스 표현 저장 + 총 제출한 인원 수 반환합니다.', async () => {
      const isSubmitUser = jest
        .spyOn(balanceReadRepository, 'isSubmitUser')
        .mockResolvedValue(false);
      const saveResult = jest.spyOn(balanceRepository, 'create');
      const submitCount = jest
        .spyOn(balanceReadRepository, 'findUserCount')
        .mockResolvedValue({
          count: 3,
        });

      await service.saveUserExpressionAndGetSubmitCount(dto);

      expect(isSubmitUser).toBeCalledTimes(1);
      expect(isSubmitUser).toBeCalledWith(
        new FindSubmitUserDto(dto.userId, dto.balanceId),
        readManager,
      );
      expect(saveResult).toBeCalledTimes(1);
      expect(saveResult).toBeCalledWith(
        new CreateUserBalanceDto(dto.userId, dto.balanceId, dto.balanceType),
      );
      expect(submitCount).toBeCalledTimes(1);
      expect(submitCount).toBeCalledWith(
        {
          urlId: dto.urlId,
          balanceId: dto.balanceId,
        },
        readManager,
      );
    });

    it('밸런스 표현을 제출한 유저가 중복 저장할 경우 오류가 발생합니다.', async () => {
      const isSubmitUser = jest
        .spyOn(balanceReadRepository, 'isSubmitUser')
        .mockResolvedValue(true);

      await expect(
        service.saveUserExpressionAndGetSubmitCount(dto),
      ).rejects.toThrow(SubmitBalanceException);

      expect(isSubmitUser).toBeCalledTimes(1);
      expect(isSubmitUser).toBeCalledWith(
        new FindSubmitUserDto(dto.userId, dto.balanceId),
        readManager,
      );
    });
  });
});
