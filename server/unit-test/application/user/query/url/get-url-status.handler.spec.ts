import {
  FindOneByUrlIdDto,
  GetUrlStatusHandler,
  GetUrlStatusQuery,
} from '@application';
import { IUrlReadRepository } from '@domain';
import { URL_READ_REPOSITORY_TOKEN } from '@infrastructure';
import { MockEntityManager } from '@mock';
import { Test, TestingModule } from '@nestjs/testing';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

describe('GetUrlStatusHandler', () => {
  let handler: GetUrlStatusHandler;
  let urlReadRepository: IUrlReadRepository;
  let readManager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUrlStatusHandler,
        {
          provide: URL_READ_REPOSITORY_TOKEN,
          useValue: {
            findOneById: jest.fn(),
          },
        },
        {
          provide: getEntityManagerToken('read'),
          useValue: MockEntityManager(),
        },
      ],
    }).compile();

    handler = module.get<GetUrlStatusHandler>(GetUrlStatusHandler);
    urlReadRepository = module.get<IUrlReadRepository>(
      URL_READ_REPOSITORY_TOKEN,
    );
    readManager = module.get<EntityManager>(getEntityManagerToken('read'));
  });

  it('IsDefined', () => {
    expect(handler).toBeDefined();
    expect(urlReadRepository).toBeDefined();
    expect(readManager).toBeDefined();
  });

  describe('execute', () => {
    const query = new GetUrlStatusQuery(111);
    const findResult = {
      getStatus: () => true,
    } as any;

    it('url 상태를 조회합니다.', async () => {
      const findOneById = jest
        .spyOn(urlReadRepository, 'findOneById')
        .mockResolvedValue(findResult);

      await handler.execute(query);

      expect(findOneById).toBeCalledTimes(1);
      expect(findOneById).toBeCalledWith(
        new FindOneByUrlIdDto(query.urlId),
        readManager,
      );
    });
  });
});
