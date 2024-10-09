import {
  CreateUserMbtiDto,
  FindSubmitMbtiUserDto,
  FindUserMbtiDto,
  MbtiService,
} from '@application';
import { SubmitMbtiException } from '@common';
import { IMbtiReadRepository, IMbtiRepository } from '@domain';
import {
  MBTI_REPOSITORY_READ_TOKEN,
  MBTI_REPOSITORY_TOKEN,
} from '@infrastructure';
import { MockEntityManager } from '@mock';
import { Test, TestingModule } from '@nestjs/testing';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

describe('MbtiService', () => {
  let service: MbtiService;
  let mbtiRepository: IMbtiRepository;
  let mbtiReadRepository: IMbtiReadRepository;
  let readManager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MbtiService,
        {
          provide: MBTI_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: MBTI_REPOSITORY_READ_TOKEN,
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

    service = module.get<MbtiService>(MbtiService);
    mbtiRepository = module.get<IMbtiRepository>(MBTI_REPOSITORY_TOKEN);
    mbtiReadRepository = module.get<IMbtiReadRepository>(
      MBTI_REPOSITORY_READ_TOKEN,
    );
    readManager = module.get<EntityManager>(getEntityManagerToken('read'));
  });

  it('IsDefined', () => {
    expect(service).toBeDefined();
    expect(mbtiRepository).toBeDefined();
    expect(mbtiReadRepository).toBeDefined();
    expect(readManager).toBeDefined();
  });

  describe('saveUserMbtiAndGetSubmitCount', () => {
    const dto = {
      urlId: 11,
      userId: 126,
      toUserId: 127,
      mbti: 'ISTJ',
    };

    it('mbti 저장 + 총 제출한 인원 수 반환합니다.', async () => {
      const isSubmitUser = jest
        .spyOn(mbtiReadRepository, 'isSubmitUser')
        .mockResolvedValue(false);
      const saveResult = jest.spyOn(mbtiRepository, 'create');
      const submitCount = jest
        .spyOn(mbtiReadRepository, 'findUserCount')
        .mockResolvedValue({
          count: 2,
        });

      await service.saveUserMbtiAndGetSubmitCount(dto);

      expect(isSubmitUser).toBeCalledTimes(1);
      expect(isSubmitUser).toBeCalledWith(
        new FindSubmitMbtiUserDto(dto.userId, dto.toUserId),
        readManager,
      );
      expect(saveResult).toBeCalledTimes(1);
      expect(saveResult).toBeCalledWith(
        new CreateUserMbtiDto(dto.userId, dto.mbti, dto.toUserId),
      );
      expect(submitCount).toBeCalledTimes(1);
      expect(submitCount).toBeCalledWith(
        new FindUserMbtiDto(dto.urlId, dto.toUserId),
        readManager,
      );
    });
    it('mbti를 제출한 유저가 중복 저장할 경우 오류가 발생합니다.', async () => {
      const isSubmitUser = jest
        .spyOn(mbtiReadRepository, 'isSubmitUser')
        .mockResolvedValue(true);

      await expect(service.saveUserMbtiAndGetSubmitCount(dto)).rejects.toThrow(
        SubmitMbtiException,
      );

      expect(isSubmitUser).toBeCalledTimes(1);
      expect(isSubmitUser).toBeCalledWith(
        new FindSubmitMbtiUserDto(dto.userId, dto.toUserId),
        readManager,
      );
    });
  });
});
