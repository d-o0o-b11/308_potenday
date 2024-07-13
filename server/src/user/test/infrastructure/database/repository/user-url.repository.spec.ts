import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserUrlRepository } from '../../../../infrastructure';
import { UserUrlEntity } from '../../../../infrastructure/database/entity/user-url.entity';
import { UserFactory, UserUrlFactory } from '../../../../domain';
import {
  CreateUserUrlDto,
  FindOneUserUrlDto,
  FindOneUserUrlWithUserDto,
  FindOneUserWithUrlDto,
  UpdateUserUrlDto,
} from '../../../../interface';

describe('UserUrlRepository', () => {
  let repository: UserUrlRepository;
  let manager: EntityManager;
  let userUrlRepository: Repository<UserUrlEntity>;
  let userUrlFactory: UserUrlFactory;
  let userFactory: UserFactory;

  const mockManager = {
    transaction: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserUrlRepository,
        {
          provide: EntityManager,
          useValue: mockManager,
        },
        {
          provide: getRepositoryToken(UserUrlEntity),
          useValue: {
            findOne: jest.fn(),
            findOneOrFail: jest.fn(),
          },
        },
        {
          provide: UserUrlFactory,
          useValue: {
            reconstitute: jest.fn(),
            reconstituteWithUser: jest.fn(),
          },
        },
        {
          provide: UserFactory,
          useValue: {
            reconstituteArray: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<UserUrlRepository>(UserUrlRepository);
    manager = module.get<EntityManager>(EntityManager);
    userUrlRepository = module.get<Repository<UserUrlEntity>>(
      getRepositoryToken(UserUrlEntity),
    );
    userUrlFactory = module.get(UserUrlFactory);
    userFactory = module.get(UserFactory);
  });

  describe('save', () => {
    const createUserUrlDto: CreateUserUrlDto = { url: 'http://example.com' };
    const savedEntity = { url: createUserUrlDto.url, id: 1, status: true };
    const reconstituted = {
      id: 1,
      url: 'http://example.com',
      status: true,
    } as any;

    it('새로운 URL을 저장합니다', async () => {
      mockManager.transaction.mockImplementation(
        async (callback) => await callback(mockManager),
      );
      const save = jest.spyOn(manager, 'save').mockResolvedValue(savedEntity);
      const reconstitute = jest
        .spyOn(userUrlFactory, 'reconstitute')
        .mockReturnValue(reconstituted);

      const result = await repository.save(createUserUrlDto);

      expect(mockManager.transaction).toHaveBeenCalled();
      expect(save).toHaveBeenCalledWith(expect.any(UserUrlEntity));
      expect(reconstitute).toHaveBeenCalledWith({
        id: savedEntity.id,
        url: savedEntity.url,
        status: savedEntity.status,
      });
      expect(result).toEqual(reconstituted);
    });

    it('트랜잭션 중 오류가 발생하면 예외를 던집니다', async () => {
      mockManager.transaction.mockImplementation(
        async (callback) => await callback(mockManager),
      );
      const save = jest
        .spyOn(manager, 'save')
        .mockRejectedValue(new Error('DB 오류'));

      await expect(repository.save(createUserUrlDto)).rejects.toThrow(
        'DB 오류',
      );

      expect(mockManager.transaction).toHaveBeenCalled();
      expect(save).toHaveBeenCalledWith(expect.any(UserUrlEntity));
    });
  });

  describe('update', () => {
    const updateUserUrlDto: UpdateUserUrlDto = { urlId: 1 };

    it('URL 상태를 업데이트합니다', async () => {
      const updateResult = { affected: 1 } as any;

      mockManager.transaction.mockImplementation(
        async (callback) => await callback(mockManager),
      );
      const update = jest
        .spyOn(manager, 'update')
        .mockResolvedValue(updateResult);

      await repository.update(updateUserUrlDto);

      expect(mockManager.transaction).toHaveBeenCalled();
      expect(update).toHaveBeenCalledWith(
        UserUrlEntity,
        updateUserUrlDto.urlId,
        {
          status: false,
        },
      );
    });

    it('URL 상태 업데이트에 실패합니다', async () => {
      const updateResult = { affected: 0 } as any;

      mockManager.transaction.mockImplementation(
        async (callback) => await callback(mockManager),
      );
      const update = jest
        .spyOn(manager, 'update')
        .mockResolvedValue(updateResult);

      await expect(repository.update(updateUserUrlDto)).rejects.toThrow(
        'url 상태 변경 실패',
      );

      expect(mockManager.transaction).toHaveBeenCalled();
      expect(update).toHaveBeenCalledWith(
        UserUrlEntity,
        updateUserUrlDto.urlId,
        {
          status: false,
        },
      );
    });
  });

  describe('findOne', () => {
    const findOneUserUrlDto: FindOneUserUrlDto = { urlId: 1 };
    const userUrlEntity = {
      id: 1,
      url: 'http://example.com',
      status: true,
    } as any;

    it('URL ID로 엔티티를 찾습니다', async () => {
      const findOne = jest
        .spyOn(userUrlRepository, 'findOne')
        .mockResolvedValue(userUrlEntity);
      const reconstitute = jest
        .spyOn(userUrlFactory, 'reconstitute')
        .mockReturnValue(userUrlEntity);

      const result = await repository.findOne(findOneUserUrlDto);

      expect(findOne).toHaveBeenCalledWith({
        where: { id: findOneUserUrlDto.urlId },
      });
      expect(reconstitute).toHaveBeenCalledWith({
        id: userUrlEntity.id,
        url: userUrlEntity.url,
        status: userUrlEntity.status,
      });
      expect(result).toEqual(userUrlEntity);
    });

    it('존재하지 않는 URL ID로 엔티티를 찾을 수 없습니다', async () => {
      const findOne = jest
        .spyOn(userUrlRepository, 'findOne')
        .mockResolvedValue(null);

      const result = await repository.findOne(findOneUserUrlDto);

      expect(findOne).toHaveBeenCalledWith({
        where: { id: findOneUserUrlDto.urlId },
      });
      expect(result).toBeNull();
    });
  });

  describe('findOneWithUrl', () => {
    const findOneUserWithUrlDto: FindOneUserWithUrlDto = {
      url: 'http://example.com',
    };
    const userUrlEntity = {
      id: 1,
      url: 'http://example.com',
      status: true,
    } as any;

    it('URL로 엔티티를 찾습니다', async () => {
      const findOne = jest
        .spyOn(userUrlRepository, 'findOne')
        .mockResolvedValue(userUrlEntity);

      const result = await repository.findOneWithUrl(findOneUserWithUrlDto);

      expect(findOne).toHaveBeenCalledWith({
        where: { url: findOneUserWithUrlDto.url },
      });
      expect(result).toBe(true);
    });

    it('존재하지 않는 URL로 엔티티를 찾을 수 없습니다', async () => {
      const findOne = jest
        .spyOn(userUrlRepository, 'findOne')
        .mockResolvedValue(null);

      const result = await repository.findOneWithUrl(findOneUserWithUrlDto);

      expect(findOne).toHaveBeenCalledWith({
        where: { url: findOneUserWithUrlDto.url },
      });
      expect(result).toBeNull();
    });
  });

  describe('findOneWithUser', () => {
    const findOneUserUrlWithUserDto: FindOneUserUrlWithUserDto = { urlId: 1 };
    const userUrlEntity = {
      id: 1,
      url: 'http://example.com',
      status: true,
      user: [
        { id: 1, imgId: 1, nickName: 'test1', urlId: 1 },
        { id: 2, imgId: 2, nickName: 'test2', urlId: 1 },
      ],
    } as any;

    const reconstitutedUsers = [
      { id: 1, imgId: 1, nickName: 'test1', urlId: 1 },
      { id: 2, imgId: 2, nickName: 'test2', urlId: 1 },
    ] as any;

    const reconstituted = {
      id: 1,
      url: 'http://example.com',
      status: true,
      users: reconstitutedUsers,
    } as any;

    it('URL ID로 엔티티와 연관된 유저들을 찾습니다', async () => {
      const findOneOrFail = jest
        .spyOn(userUrlRepository, 'findOneOrFail')
        .mockResolvedValue(userUrlEntity);
      const reconstituteArray = jest
        .spyOn(userFactory, 'reconstituteArray')
        .mockReturnValueOnce(reconstitutedUsers[0])
        .mockReturnValueOnce(reconstitutedUsers[1]);

      const reconstituteWithUser = jest
        .spyOn(userUrlFactory, 'reconstituteWithUser')
        .mockReturnValue(reconstituted);

      const result = await repository.findOneWithUser(
        findOneUserUrlWithUserDto,
      );

      expect(findOneOrFail).toHaveBeenCalledWith({
        where: { id: findOneUserUrlWithUserDto.urlId },
        relations: { user: true },
        order: { user: { createdAt: 'ASC' } },
      });
      expect(reconstituteArray).toHaveBeenCalledTimes(
        reconstitutedUsers.length,
      );
      expect(reconstituteArray).toHaveBeenNthCalledWith(
        1,
        userUrlEntity.user[0],
      );
      expect(reconstituteArray).toHaveBeenNthCalledWith(
        2,
        userUrlEntity.user[1],
      );
      expect(reconstituteWithUser).toHaveBeenCalledWith({
        id: userUrlEntity.id,
        url: userUrlEntity.url,
        status: userUrlEntity.status,
        users: reconstitutedUsers,
      });
      expect(result).toEqual(reconstituted);
    });
  });
});
