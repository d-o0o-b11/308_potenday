jest.mock('crypto', () => {
  const actualCrypto = jest.requireActual('crypto');
  return {
    ...actualCrypto, // 실제 crypto 모듈의 다른 부분은 유지
    randomBytes: jest.fn(() => 'TEST'), // randomBytes만 모킹
  };
});

import {
  CreateUserUrlDto,
  FindOneByUrlIdDto,
  FindOneUserWithUrlDto,
  UpdateUserUrlDto,
  UrlService,
} from '@application';
import { AlreadyClickButtonUrlException, NotFoundUrlException } from '@common';
import {
  IUrlReadRepository,
  IUrlRepository,
  IUserReadRepository,
} from '@domain';
import {
  URL_READ_REPOSITORY_TOKEN,
  URL_REPOSITORY_TOKEN,
  USER_READ_REPOSITORY_TOKEN,
} from '@infrastructure';
import { MockEntityManager } from '@mock';
import { Test, TestingModule } from '@nestjs/testing';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

describe('UrlService', () => {
  let service: UrlService;
  let urlRepository: IUrlRepository;
  let urlReadRepository: IUrlReadRepository;
  let userReadRepository: IUserReadRepository;
  let manager: EntityManager;
  let readManager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        {
          provide: URL_REPOSITORY_TOKEN,
          useValue: {
            save: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: URL_READ_REPOSITORY_TOKEN,
          useValue: {
            findOneById: jest.fn(),
            findOneByUrl: jest.fn(),
          },
        },
        {
          provide: USER_READ_REPOSITORY_TOKEN,
          useValue: {
            findList: jest.fn(),
          },
        },
        {
          provide: getEntityManagerToken(),
          useValue: MockEntityManager(),
        },
        {
          provide: getEntityManagerToken('read'),
          useValue: MockEntityManager(),
        },
      ],
    }).compile();

    service = module.get<UrlService>(UrlService);
    urlRepository = module.get<IUrlRepository>(URL_REPOSITORY_TOKEN);
    urlReadRepository = module.get<IUrlReadRepository>(
      URL_READ_REPOSITORY_TOKEN,
    );
    userReadRepository = module.get<IUserReadRepository>(
      USER_READ_REPOSITORY_TOKEN,
    );
    manager = module.get<EntityManager>(getEntityManagerToken());
    readManager = module.get<EntityManager>(getEntityManagerToken('read'));
  });

  it('IsDefined', () => {
    expect(service).toBeDefined();
    expect(urlRepository).toBeDefined();
    expect(urlReadRepository).toBeDefined();
    expect(userReadRepository).toBeDefined();
    expect(manager).toBeDefined();
    expect(readManager).toBeDefined();
  });

  describe('setUrl', () => {
    it('url을 발급받습니다.', async () => {
      const findOneByUrl = jest
        .spyOn(urlReadRepository, 'findOneByUrl')
        .mockResolvedValue(null);
      const save = jest.spyOn(urlRepository, 'save');

      await service.setUrl();

      expect(findOneByUrl).toBeCalledTimes(1);
      expect(findOneByUrl).toBeCalledWith(
        new FindOneUserWithUrlDto('TEST'),
        readManager,
      );
      expect(save).toBeCalledTimes(1);
      expect(save).toBeCalledWith(new CreateUserUrlDto('TEST'), manager);
    });
  });

  describe('checkUserLimitForUrl', () => {
    const dto = { urlId: 111 };

    it('존재하지 않는 url일 경우 에러를 반환합니다.', async () => {
      const findOneById = jest
        .spyOn(urlReadRepository, 'findOneById')
        .mockResolvedValue(null);

      await expect(service.checkUserLimitForUrl(dto)).rejects.toThrowError(
        new NotFoundUrlException(),
      );

      expect(findOneById).toBeCalledTimes(1);
      expect(findOneById).toBeCalledWith(
        new FindOneByUrlIdDto(dto.urlId),
        readManager,
      );
    });

    it('해당 url에 참가자가 0명일 경우 빈 배열을 반환합니다.', async () => {
      const findResult = {
        getUserIdList: () => null,
        getStatus: () => true,
      } as any;

      const findOneById = jest
        .spyOn(urlReadRepository, 'findOneById')
        .mockResolvedValue(findResult);

      const result = await service.checkUserLimitForUrl(dto);

      expect(findOneById).toBeCalledTimes(1);
      expect(findOneById).toBeCalledWith(
        new FindOneByUrlIdDto(dto.urlId),
        readManager,
      );
      expect(result).toStrictEqual({
        userCount: 0,
        userInfo: [],
        status: findResult.getStatus(),
      });
    });

    it('해당 url에 참가하고 있는 참가자 정보, 인원 수를 반환합니다.', async () => {
      const findResult = {
        getUserIdList: () => [126],
        getStatus: () => true,
      } as any;
      const userList = {
        userCount: 1,
        userInfo: {
          name: 126,
        },
      } as any;

      const findOneById = jest
        .spyOn(urlReadRepository, 'findOneById')
        .mockResolvedValue(findResult);
      const countUsersInRoom = jest
        .spyOn(service, 'countUsersInRoom')
        .mockResolvedValue(userList);

      const result = await service.checkUserLimitForUrl(dto);

      expect(findOneById).toBeCalledTimes(1);
      expect(findOneById).toBeCalledWith(
        new FindOneByUrlIdDto(dto.urlId),
        readManager,
      );
      expect(countUsersInRoom).toBeCalledTimes(1);
      expect(countUsersInRoom).toBeCalledWith(
        findResult.getUserIdList(),
        readManager,
      );
      expect(result).toStrictEqual({
        userCount: userList.userCount,
        userInfo: userList.userInfo,
        status: findResult.getStatus(),
      });
    });
  });

  describe('countUsersInRoom', () => {
    const userIdList = [126, 127];

    it('url에 속한 유저 정보, 인원 수를 반환합니다.', async () => {
      const findListResult = [
        {
          name: 'd_o0o_b',
        },
        {
          name: 'd_o0o_b2',
        },
      ] as any;

      const findList = jest
        .spyOn(userReadRepository, 'findList')
        .mockResolvedValue(findListResult);

      const result = await service.countUsersInRoom(userIdList, manager);

      expect(findList).toBeCalledTimes(1);
      expect(findList).toBeCalledWith(userIdList, manager);
      expect(result).toStrictEqual({
        userCount: findListResult.length,
        userInfo: findListResult,
      });
    });
  });

  describe('updateStatusFalse', () => {
    const urlId = 111;

    it('존재하지 않는 url일 경우 에러를 반환합니다.', async () => {
      const findOneById = jest
        .spyOn(urlReadRepository, 'findOneById')
        .mockResolvedValue(null);

      await expect(service.updateStatusFalse(urlId)).rejects.toThrowError(
        new NotFoundUrlException(),
      );

      expect(findOneById).toBeCalledTimes(1);
      expect(findOneById).toBeCalledWith(
        new FindOneByUrlIdDto(urlId),
        readManager,
      );
    });

    it('게임중인 url일 경우 수정할 수 없습니다.', async () => {
      const findOneById = jest
        .spyOn(urlReadRepository, 'findOneById')
        .mockResolvedValue({
          getStatus: () => false,
        } as any);

      await expect(service.updateStatusFalse(urlId)).rejects.toThrowError(
        new AlreadyClickButtonUrlException(),
      );

      expect(findOneById).toBeCalledTimes(1);
      expect(findOneById).toBeCalledWith(
        new FindOneByUrlIdDto(urlId),
        readManager,
      );
    });

    it('url status를 false로 업데이트 합니다.', async () => {
      const findResult = {
        getStatus: () => true,
        getUrlId: () => urlId,
      } as any;

      const findOneById = jest
        .spyOn(urlReadRepository, 'findOneById')
        .mockResolvedValue(findResult);
      const transaction = jest
        .spyOn(manager, 'transaction')
        .mockImplementation((fn: any) => fn(manager));
      //fn : 트랜잭션 내에서 실행될 콜백 함수
      //fn(manager): 트랜잭션 콜백 함수 fn을 호출하고, 그 인자로 manager를 넘깁니다. 실제 트랜잭션 로직이 실행될 때처럼, 트랜잭션 안에서 manager를 사용할 수 있게 합니다.
      const update = jest.spyOn(urlRepository, 'update');

      await service.updateStatusFalse(urlId);

      expect(findOneById).toBeCalledTimes(1);
      expect(findOneById).toBeCalledWith(
        new FindOneByUrlIdDto(urlId),
        readManager,
      );
      expect(transaction).toBeCalledTimes(1);
      expect(update).toBeCalledTimes(1);
      expect(update).toBeCalledWith(
        findResult.getUrlId(),
        new UpdateUserUrlDto(false),
        manager,
      );
    });
  });

  describe('getUserInfoInUrl', () => {
    const urlId = 111;
    const findResult = {
      getUserIdList: () => [126, 127],
    } as any;

    it('url에 속한 userId를 반환합니다.', async () => {
      const findOneById = jest
        .spyOn(urlReadRepository, 'findOneById')
        .mockResolvedValue(findResult);
      const findList = jest.spyOn(userReadRepository, 'findList');

      await service.getUserInfoInUrl(urlId);

      expect(findOneById).toBeCalledTimes(1);
      expect(findOneById).toBeCalledWith(
        new FindOneByUrlIdDto(urlId),
        readManager,
      );
      expect(findList).toBeCalledTimes(1);
      expect(findList).toBeCalledWith(findResult.getUserIdList(), readManager);
    });
  });
});
