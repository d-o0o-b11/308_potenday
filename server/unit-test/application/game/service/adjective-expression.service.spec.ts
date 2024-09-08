import {
  AdjectiveExpressionService,
  SaveUserAdjectiveExpressionDto,
} from '@application';
import { SubmitAdjectiveExpressionException } from '@common';
import {
  IAdjectiveExpressionRepository,
  IAdjectiveExpressionRepositoryReadRepository,
} from '@domain';
import {
  ADJECTIVE_EXPRESSION_REPOSITORY_READ_TOKEN,
  ADJECTIVE_EXPRESSION_REPOSITORY_TOKEN,
} from '@infrastructure';
import { MockEntityManager } from '@mock';
import { Test, TestingModule } from '@nestjs/testing';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

describe('AdjectiveExpressionService', () => {
  let service: AdjectiveExpressionService;
  let adjectiveExpressionRepository: IAdjectiveExpressionRepository;
  let adjectiveExpressionReadRepository: IAdjectiveExpressionRepositoryReadRepository;
  let readManager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdjectiveExpressionService,
        {
          provide: ADJECTIVE_EXPRESSION_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: ADJECTIVE_EXPRESSION_REPOSITORY_READ_TOKEN,
          useValue: {
            isSubmitUser: jest.fn(),
            findUsersByUrlId: jest.fn(),
          },
        },
        {
          provide: getEntityManagerToken('read'),
          useValue: MockEntityManager(),
        },
      ],
    }).compile();

    service = module.get<AdjectiveExpressionService>(
      AdjectiveExpressionService,
    );
    adjectiveExpressionRepository = module.get<IAdjectiveExpressionRepository>(
      ADJECTIVE_EXPRESSION_REPOSITORY_TOKEN,
    );
    adjectiveExpressionReadRepository =
      module.get<IAdjectiveExpressionRepositoryReadRepository>(
        ADJECTIVE_EXPRESSION_REPOSITORY_READ_TOKEN,
      );
    readManager = module.get<EntityManager>(getEntityManagerToken('read'));
  });

  it('IsDefined', () => {
    expect(service).toBeDefined();
    expect(adjectiveExpressionRepository).toBeDefined();
    expect(adjectiveExpressionReadRepository).toBeDefined();
    expect(readManager).toBeDefined();
  });

  describe('saveUserExpressionAndGetSubmitCount', () => {
    const dto = {
      userId: 126,
      expressionIdList: [1, 3, 11],
      urlId: 111,
    };

    it('형용사 표현 저장 + 총 제출한 인원 수 반환합니다.', async () => {
      const isSubmitUser = jest
        .spyOn(adjectiveExpressionReadRepository, 'isSubmitUser')
        .mockResolvedValue(false);
      const saveResult = jest.spyOn(adjectiveExpressionRepository, 'create');
      const submitCount = jest
        .spyOn(adjectiveExpressionReadRepository, 'findUsersByUrlId')
        .mockResolvedValue({
          length: 2,
        } as any);

      await service.saveUserExpressionAndGetSubmitCount(dto);

      expect(isSubmitUser).toBeCalledTimes(1);
      expect(isSubmitUser).toBeCalledWith(dto.userId, readManager);
      expect(saveResult).toBeCalledTimes(1);
      expect(saveResult).toBeCalledWith(
        new SaveUserAdjectiveExpressionDto(dto.userId, dto.expressionIdList),
      );
      expect(submitCount).toBeCalledTimes(1);
      expect(submitCount).toBeCalledWith(dto.urlId, readManager);
    });

    it('형용사 표현을 제출한 유저가 중복 저장할 경우 오류가 발생합니다.', async () => {
      const isSubmitUser = jest
        .spyOn(adjectiveExpressionReadRepository, 'isSubmitUser')
        .mockResolvedValue(true);

      await expect(
        service.saveUserExpressionAndGetSubmitCount(dto),
      ).rejects.toThrow(SubmitAdjectiveExpressionException);

      expect(isSubmitUser).toBeCalledTimes(1);
      expect(isSubmitUser).toBeCalledWith(dto.userId, readManager);
    });
  });
});
