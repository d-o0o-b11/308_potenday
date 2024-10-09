import { EntityManager } from 'typeorm';
import {
  CreateUserUrlReadDto,
  UpdateUserUrlStatusDto,
  UpdateUserIdDto,
  DeleteUserIdDto,
  FindOneByUrlIdDto,
  FindOneUserWithUrlDto,
  ReconstituteFindFactoryDto,
} from '@application';
import { UrlFactory } from '@domain';
import {
  DeleteUrlException,
  DeleteUrlUserIdException,
  UpdateUrlException,
  UpdateUrlUserIdListException,
} from '@common';
import {
  UrlReadEntity,
  UrlReadRepository,
  UserUrlMapper,
} from '@infrastructure';
import { Test, TestingModule } from '@nestjs/testing';
import { MockEntityManager } from '@mock';

describe('UrlReadRepository', () => {
  let repository: UrlReadRepository;
  let manager: EntityManager;
  let urlFactory: UrlFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlReadRepository,
        {
          provide: UrlFactory,
          useValue: {
            reconstituteRead: jest.fn(),
            reconstituteFind: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<UrlReadRepository>(UrlReadRepository);
    manager = MockEntityManager();
    urlFactory = module.get<UrlFactory>(UrlFactory);
  });

  it('IsDefined', () => {
    expect(repository).toBeDefined();
    expect(urlFactory).toBeDefined();
  });

  describe('create', () => {
    const dto = new CreateUserUrlReadDto(
      1,
      'TEST_URL',
      false,
      new Date(),
      new Date(),
      null,
    );

    const mockUrlRead = {
      urlId: dto.urlId,
      url: dto.url,
      status: dto.status,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      deletedAt: dto.deletedAt,
    } as any;

    it('URL을 저장합니다.', async () => {
      const expectedUrlReadEntity = UserUrlMapper.toEntityRead(mockUrlRead);

      const reconstituteRead = jest
        .spyOn(urlFactory, 'reconstituteRead')
        .mockReturnValue(mockUrlRead);

      const save = jest.spyOn(manager, 'save');

      await repository.create(dto, manager);

      expect(reconstituteRead).toHaveBeenCalledWith(
        expect.objectContaining({
          urlId: dto.urlId,
          url: dto.url,
          status: dto.status,
          createdAt: dto.createdAt,
          updatedAt: dto.updatedAt,
          deletedAt: dto.deletedAt,
        }),
      );

      expect(save).toHaveBeenCalledWith(expectedUrlReadEntity);
    });
  });

  describe('updateStatus', () => {
    it('url 상태를 변경합니다.', async () => {
      const dto = new UpdateUserUrlStatusDto(1, true);

      const queryBuilder = manager.createQueryBuilder();
      jest.spyOn(manager, 'createQueryBuilder').mockReturnValue(queryBuilder);

      const update = jest.spyOn(queryBuilder, 'update');
      const set = jest.spyOn(queryBuilder, 'set' as any);
      const where = jest.spyOn(queryBuilder, 'where');
      const execute = jest
        .spyOn(queryBuilder, 'execute')
        .mockResolvedValue({ affected: 1 });

      await repository.updateStatus(dto, manager);

      expect(update).toBeCalledTimes(1);
      expect(update).toBeCalledWith(UrlReadEntity);
      expect(set).toBeCalledTimes(1);
      expect(set).toBeCalledWith(
        expect.objectContaining({
          data: expect.any(Function),
        }),
      );
      expect(where).toBeCalledTimes(1);
      expect(where).toBeCalledWith("data->>'urlId' = :urlId", {
        urlId: dto.urlId,
      });
      expect(execute).toBeCalledTimes(1);
    });

    it('url 상태를 변경 실패 시 오류를 반환합니다.', async () => {
      const dto = new UpdateUserUrlStatusDto(1, true);

      const queryBuilder = manager.createQueryBuilder();
      jest.spyOn(manager, 'createQueryBuilder').mockReturnValue(queryBuilder);

      const execute = jest
        .spyOn(queryBuilder, 'execute')
        .mockResolvedValue({ affected: 0 });

      await expect(repository.updateStatus(dto, manager)).rejects.toThrowError(
        new UpdateUrlException(),
      );

      expect(execute).toBeCalledTimes(1);
    });
  });

  describe('updateUserList', () => {
    const dto = new UpdateUserIdDto(1, 126);

    it('url의 userList에 유저를 추가합니다.', async () => {
      const queryBuilder = manager.createQueryBuilder();
      jest.spyOn(manager, 'createQueryBuilder').mockReturnValue(queryBuilder);

      const update = jest.spyOn(queryBuilder, 'update');
      const set = jest.spyOn(queryBuilder, 'set' as any);
      const where = jest.spyOn(queryBuilder, 'where');
      const execute = jest
        .spyOn(queryBuilder, 'execute')
        .mockResolvedValue({ affected: 1 });

      await repository.updateUserList(dto, manager);

      expect(update).toBeCalledTimes(1);
      expect(update).toBeCalledWith(UrlReadEntity);
      expect(set).toBeCalledTimes(1);
      expect(set).toBeCalledWith(
        expect.objectContaining({
          data: expect.any(Function),
        }),
      );
      expect(where).toBeCalledTimes(1);
      expect(where).toBeCalledWith("data->>'urlId' = :urlId", {
        urlId: dto.urlId,
      });
      expect(execute).toBeCalledTimes(1);
    });

    it('url의 userList 수정 과정에서 오류를 반환합니다.', async () => {
      const queryBuilder = manager.createQueryBuilder();
      jest.spyOn(manager, 'createQueryBuilder').mockReturnValue(queryBuilder);
      const execute = jest
        .spyOn(queryBuilder, 'execute')
        .mockResolvedValue({ affected: 0 });

      await expect(
        repository.updateUserList(dto, manager),
      ).rejects.toThrowError(new UpdateUrlUserIdListException());
      expect(execute).toBeCalledTimes(1);
    });
  });

  describe('findOneById', () => {
    const dto = new FindOneByUrlIdDto(1);

    it('url에 속한 userIdList, url 정보를 조회합니다.', async () => {
      const mockResult = {
        data: { urlId: 1, url: 'TEST_URL', status: false, userIdList: [] },
      };
      const queryBuilder = manager.createQueryBuilder();
      jest.spyOn(manager, 'createQueryBuilder').mockReturnValue(queryBuilder);

      const select = jest.spyOn(queryBuilder, 'select');
      const from = jest.spyOn(queryBuilder, 'from');
      const where = jest.spyOn(queryBuilder, 'where');
      const getRawOne = jest
        .spyOn(queryBuilder, 'getRawOne')
        .mockResolvedValue(mockResult);
      const reconstituteFind = jest.spyOn(urlFactory, 'reconstituteFind');

      await repository.findOneById(dto, manager);

      expect(select).toBeCalledTimes(1);
      expect(select).toBeCalledWith('url.data', 'data');
      expect(from).toBeCalledTimes(1);
      expect(from).toBeCalledWith(UrlReadEntity, 'url');
      expect(where).toBeCalledTimes(1);
      expect(where).toBeCalledWith("url.data->>'urlId' = :urlId", {
        urlId: dto.urlId,
      });
      expect(getRawOne).toBeCalledTimes(1);
      expect(reconstituteFind).toBeCalledTimes(1);
      expect(reconstituteFind).toBeCalledWith(
        new ReconstituteFindFactoryDto(
          mockResult.data.urlId,
          mockResult.data.url,
          mockResult.data.status,
          mockResult.data.userIdList,
        ),
      );
    });

    it('url 정보가 없을 경우 null을 반환합니다.', async () => {
      const queryBuilder = manager.createQueryBuilder();
      jest.spyOn(manager, 'createQueryBuilder').mockReturnValue(queryBuilder);
      const getRawOne = jest
        .spyOn(queryBuilder, 'getRawOne')
        .mockResolvedValue(null);

      const result = await repository.findOneById(dto, manager);

      expect(result).toBeNull();
      expect(getRawOne).toBeCalledTimes(1);
    });
  });

  describe('findOneByUrl', () => {
    const dto = new FindOneUserWithUrlDto('TEST_URL');

    it('url이 존재하는지 조회합니다. (존재)', async () => {
      const queryBuilder = manager.createQueryBuilder();
      jest.spyOn(manager, 'createQueryBuilder').mockReturnValue(queryBuilder);
      jest.spyOn(queryBuilder, 'getRawOne').mockResolvedValue({ id: 1 });

      const result = await repository.findOneByUrl(dto, manager);

      expect(result).toBe(true);
    });

    it('url이 존재하는지 조회합니다. (미존재)', async () => {
      const queryBuilder = manager.createQueryBuilder();
      jest.spyOn(manager, 'createQueryBuilder').mockReturnValue(queryBuilder);
      jest.spyOn(queryBuilder, 'getRawOne').mockResolvedValue(null);

      const result = await repository.findOneByUrl(dto, manager);

      expect(result).toBe(false);
    });
  });

  describe('delete', () => {
    const urlId = 111;

    it('url을 삭제합니다.', async () => {
      const queryBuilder = manager.createQueryBuilder();
      jest.spyOn(manager, 'createQueryBuilder').mockReturnValue(queryBuilder);
      const delete2 = jest.spyOn(queryBuilder, 'delete');
      const from = jest.spyOn(queryBuilder, 'from');
      const where = jest.spyOn(queryBuilder, 'where');
      const execute = jest
        .spyOn(queryBuilder, 'execute')
        .mockResolvedValue({ affected: 1 });

      await repository.delete(urlId, manager);

      expect(delete2).toBeCalledTimes(1);
      expect(from).toBeCalledTimes(1);
      expect(from).toBeCalledWith(UrlReadEntity, 'url');
      expect(where).toBeCalledTimes(1);
      expect(where).toBeCalledWith("url.data->>'urlId' = :urlId", { urlId });
      expect(execute).toHaveBeenCalled();
    });

    it('url 삭제 실패 시 오류를 반환합니다.', async () => {
      const queryBuilder = manager.createQueryBuilder();
      jest.spyOn(manager, 'createQueryBuilder').mockReturnValue(queryBuilder);
      const execute = jest
        .spyOn(queryBuilder, 'execute')
        .mockResolvedValue({ affected: 0 });

      await expect(repository.delete(urlId, manager)).rejects.toThrowError(
        new DeleteUrlException(),
      );
      expect(execute).toHaveBeenCalled();
    });
  });

  describe('deleteUserId', () => {
    const urlId = 11;
    const dto = new DeleteUserIdDto(100);

    it('userIdList의 user를 제거합니다.', async () => {
      const queryBuilder = manager.createQueryBuilder();
      jest.spyOn(manager, 'createQueryBuilder').mockReturnValue(queryBuilder);
      const update = jest.spyOn(queryBuilder, 'update');
      const set = jest.spyOn(queryBuilder, 'set' as any);
      const where = jest.spyOn(queryBuilder, 'where');
      const execute = jest
        .spyOn(queryBuilder, 'execute')
        .mockResolvedValue({ affected: 1 });

      await repository.deleteUserId(urlId, dto, manager);

      expect(update).toBeCalledTimes(1);
      expect(update).toBeCalledWith(UrlReadEntity);
      expect(set).toBeCalledTimes(1);
      expect(set).toBeCalledWith(
        expect.objectContaining({
          data: expect.any(Function),
        }),
      );
      expect(where).toBeCalledTimes(1);
      expect(where).toBeCalledWith("data->>'urlId' = :urlId", { urlId });
      expect(execute).toHaveBeenCalled();
    });

    it('userIdList의 user를 제거 실패시 오류를 반환합니다.', async () => {
      const queryBuilder = manager.createQueryBuilder();
      jest.spyOn(manager, 'createQueryBuilder').mockReturnValue(queryBuilder);
      const execute = jest
        .spyOn(queryBuilder, 'execute')
        .mockResolvedValue({ affected: 0 });

      await expect(
        repository.deleteUserId(urlId, dto, manager),
      ).rejects.toThrowError(new DeleteUrlUserIdException());

      expect(execute).toHaveBeenCalled();
    });
  });
});
