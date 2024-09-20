import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';
import { UserFactory } from '@domain';
import { DeleteUserException } from '@common';
import { CreateUserDto } from '@application';
import { MockEntityManager } from '@mock';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { UserEntity, UserMapper, UserRepository } from '@infrastructure';

describe('UserRepository', () => {
  let repository: UserRepository;
  let manager: EntityManager;
  let userFactory: UserFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getEntityManagerToken(),
          useValue: MockEntityManager(),
        },
        {
          provide: UserFactory,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
    manager = module.get<EntityManager>(getEntityManagerToken());
    userFactory = module.get<UserFactory>(UserFactory);
  });

  it('IsDefined', () => {
    expect(repository).toBeDefined();
    expect(manager).toBeDefined();
    expect(userFactory).toBeDefined();
  });

  describe('create', () => {
    const dto = new CreateUserDto(111, 1, 'd_o0o_b');

    const mockUserEntity = {
      id: 1,
      imgId: 1,
      urlId: 1,
      nickName: 'd_o0o_b',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    const mockUser = {
      userId: 1,
      imgId: 1,
      urlId: 1,
      nickName: 'd_o0o_b',
      createdAt: mockUserEntity.createdAt,
      updatedAt: mockUserEntity.updatedAt,
      deletedAt: null,
    };

    it('user를 생성합니다..', async () => {
      const transaction = jest
        .spyOn(manager, 'transaction')
        .mockImplementation(async (cb: any) => {
          return await cb(manager);
        });
      const save = jest
        .spyOn(manager, 'save')
        .mockResolvedValue(mockUserEntity);
      jest.spyOn(UserMapper, 'toEntity').mockReturnValue(mockUserEntity as any);
      const create = jest
        .spyOn(userFactory, 'create')
        .mockReturnValue(mockUser as any);

      await repository.create(dto);

      expect(transaction).toBeCalledTimes(1);
      expect(save).toHaveBeenCalledWith(mockUserEntity);
      expect(create).toBeCalledTimes(1);
      expect(create).toHaveBeenCalledWith({
        userId: mockUserEntity.id,
        imgId: mockUserEntity.imgId,
        urlId: mockUserEntity.urlId,
        nickName: mockUserEntity.nickName,
        createdAt: mockUserEntity.createdAt,
        updatedAt: mockUserEntity.updatedAt,
        deletedAt: mockUserEntity.deletedAt,
      });
    });
  });

  describe('delete', () => {
    const userId = 1;

    it('user를 삭제합니다.', async () => {
      const delete2 = jest
        .spyOn(manager, 'delete')
        .mockResolvedValue({ affected: 1 } as any);

      await repository.delete(userId, manager);

      expect(delete2).toBeCalledTimes(1);
      expect(delete2).toHaveBeenCalledWith(UserEntity, userId);
    });

    it('user 삭제 실패 시 오류를 반환합니다.', async () => {
      const delete2 = jest
        .spyOn(manager, 'delete')
        .mockResolvedValue({ affected: 0 } as any);

      await expect(repository.delete(userId, manager)).rejects.toThrowError(
        new DeleteUserException(),
      );

      expect(delete2).toBeCalledTimes(1);
      expect(delete2).toHaveBeenCalledWith(UserEntity, userId);
    });
  });
});
