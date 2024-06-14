import { Repository } from 'typeorm';
import { PublicQuestionGameService } from '../service/pubilc-question.service';
import { CommonQuestionEntity } from '../entities/common-question.entity';
import { UserUrlService } from 'src/user-url/user-url.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockRepository } from 'src/mock/mock.repository';

describe('PublicQuestionGameService', () => {
  let service: PublicQuestionGameService;
  let commonQuestionEntityRepository: Repository<CommonQuestionEntity>;
  let userUrlService: UserUrlService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublicQuestionGameService,
        {
          provide: getRepositoryToken(CommonQuestionEntity),
          useValue: mockRepository(),
        },
        {
          provide: UserUrlService,
          useValue: {
            findUrlId: jest.fn(),
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

    service = module.get<PublicQuestionGameService>(PublicQuestionGameService);
    commonQuestionEntityRepository = module.get<
      Repository<CommonQuestionEntity>
    >(getRepositoryToken(CommonQuestionEntity));
    userUrlService = module.get<UserUrlService>(UserUrlService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(commonQuestionEntityRepository).toBeDefined();
    expect(userUrlService).toBeDefined();
    expect(eventEmitter).toBeDefined();
  });

  describe('nextPublicQuestion', () => {
    const findOneResueltDummyData = {
      id: 1,
      url: 'aaaa',
      status: false,
      created_at: new Date('2023-09-12'),
    } as any;

    const UpdateQuestionStatusDto = {
      question_id: 1,
      url: 'aaaa',
    } as any;

    const UpdateQuestionStatusDto2 = {
      question_id: 2,
      url: 'aaaa',
    } as any;

    it('공통 질문 1번째 질문', async () => {
      const findOneResuelt = jest
        .spyOn(userUrlService, 'findUrlId')
        .mockResolvedValue(findOneResueltDummyData);

      const saveResult = jest.spyOn(commonQuestionEntityRepository, 'save');

      const updateColumns = jest.spyOn(
        commonQuestionEntityRepository,
        'update',
      );

      const statusUpdated = jest.spyOn(eventEmitter, 'emit');

      await service.nextPublicQuestion(UpdateQuestionStatusDto);

      expect(findOneResuelt).toBeCalledTimes(1);
      expect(findOneResuelt).toBeCalledWith(UpdateQuestionStatusDto.url);

      expect(saveResult).toBeCalledTimes(1);
      expect(saveResult).toBeCalledWith({
        url_id: findOneResueltDummyData.id,
      });

      expect(updateColumns).toBeCalledTimes(1);
      expect(updateColumns).toBeCalledWith(findOneResueltDummyData.id, {
        question_1: true,
      });

      expect(statusUpdated).toBeCalledTimes(1);
      expect(statusUpdated).toBeCalledWith('statusUpdated', {
        url: UpdateQuestionStatusDto.url,
        status: true,
      });
    });

    it('공통 질문 1번 아닌 경우', async () => {
      const findOneResuelt = jest
        .spyOn(userUrlService, 'findUrlId')
        .mockResolvedValue(findOneResueltDummyData);

      const saveResult = jest.spyOn(commonQuestionEntityRepository, 'save');

      const updateColumns = jest.spyOn(
        commonQuestionEntityRepository,
        'update',
      );

      const statusUpdated = jest.spyOn(eventEmitter, 'emit');

      await service.nextPublicQuestion(UpdateQuestionStatusDto2);

      expect(findOneResuelt).toBeCalledTimes(1);
      expect(findOneResuelt).toBeCalledWith(UpdateQuestionStatusDto.url);

      expect(saveResult).toBeCalledTimes(0);

      expect(updateColumns).toBeCalledTimes(1);
      expect(updateColumns).toBeCalledWith(findOneResueltDummyData.id, {
        question_2: true,
      });

      expect(statusUpdated).toBeCalledTimes(1);
      expect(statusUpdated).toBeCalledWith('statusUpdated', {
        url: UpdateQuestionStatusDto.url,
        status: true,
      });
    });
  });
});
