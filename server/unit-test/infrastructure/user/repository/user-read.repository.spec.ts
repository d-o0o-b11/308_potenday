import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';
import { BALANCE_TYPES, UserFactory } from '@domain';
import { CreateUserReadDto } from '@application';
import { DeleteUserException } from '@common';
import {
  UserMapper,
  UserReadEntity,
  UserReadRepository,
} from '@infrastructure';
import { MockEntityManager } from '@mock';

describe('UserReadRepository', () => {
  let repository: UserReadRepository;
  let manager: EntityManager;
  let userFactory: UserFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserReadRepository,
        {
          provide: UserFactory,
          useValue: {
            reconstituteRead: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<UserReadRepository>(UserReadRepository);
    manager = MockEntityManager();
    userFactory = module.get<UserFactory>(UserFactory);
  });

  it('IsDefined', () => {
    expect(repository).toBeDefined();
    expect(userFactory).toBeDefined();
  });

  describe('create', () => {
    const dto = new CreateUserReadDto(
      126,
      2,
      'd_o0o_b',
      111,
      new Date(),
      new Date(),
      null,
      null,
      null,
      null,
    );

    const mockUserRead = {
      userId: dto.userId,
      imgId: dto.imgId,
      nickname: dto.nickname,
      urlId: dto.urlId,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      deletedAt: dto.deletedAt,
      balance: dto.balance,
      mbti: dto.mbti,
      adjectiveExpressionList: dto.adjectiveExpression,
    };

    it('User를 저장합니다.', async () => {
      jest
        .spyOn(userFactory, 'reconstituteRead')
        .mockReturnValue(mockUserRead as any);
      const saveSpy = jest.spyOn(manager, 'save');

      await repository.create(dto, manager);

      expect(userFactory.reconstituteRead).toHaveBeenCalledWith(dto);
      expect(saveSpy).toHaveBeenCalledWith(
        UserMapper.toEntityRead(mockUserRead as any),
      );
    });
  });

  describe('findList', () => {
    const userIdList = [1, 2];
    const mockUsers = [
      {
        data: {
          userId: 1,
          imgId: 1,
          nickname: 'd_o0o_b',
          urlId: 111,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          balance: [
            {
              balanceId: 1,
              balanceType: BALANCE_TYPES.A,
              createdAt: '2024-09-21',
            },
          ],
          mbti: [
            {
              mbtiId: 1,
              mbti: 'INTJ',
              toUserId: 1,
              createdAt: '2024-09-21',
            },
          ],
          adjectiveExpressionList: {
            adjectiveExpressionIdList: [1, 11],
            createdAt: '2024-09-21',
          },
        },
      },
      {
        data: {
          userId: 2,
          imgId: 2,
          nickname: 'd_o0o_b2',
          urlId: 111,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          balance: [
            {
              balanceId: 1,
              balanceType: BALANCE_TYPES.B,
              createdAt: '2024-09-21',
            },
          ],
          mbti: [
            {
              mbtiId: 1,
              mbti: 'ENTP',
              toUserId: 1,
              createdAt: '2024-09-21',
            },
          ],
          adjectiveExpressionList: {
            adjectiveExpressionIdList: [2, 12],
            createdAt: '2024-09-21',
          },
        },
      },
    ];

    it('유저 ID 목록에 해당하는 유저들을 조회합니다.', async () => {
      const queryBuilder = manager.createQueryBuilder();
      jest.spyOn(manager, 'createQueryBuilder').mockReturnValue(queryBuilder);
      const select = jest.spyOn(queryBuilder, 'select');
      const from = jest.spyOn(queryBuilder, 'from');
      const where = jest.spyOn(queryBuilder, 'where');
      const getRawOne = jest
        .spyOn(manager.createQueryBuilder(), 'getRawOne')
        .mockResolvedValueOnce(mockUsers[0])
        .mockResolvedValueOnce(mockUsers[1]);

      const reconstituteRead = jest.spyOn(userFactory, 'reconstituteRead');

      await repository.findList(userIdList, manager);

      expect(select).toBeCalledTimes(userIdList.length);
      expect(select).toBeCalledWith('user_read.data', 'data');
      expect(from).toBeCalledTimes(userIdList.length);
      expect(from).toBeCalledWith(UserReadEntity, 'user_read');
      expect(where).toBeCalledTimes(userIdList.length);
      userIdList.forEach((element, idx) => {
        expect(where).toHaveBeenNthCalledWith(
          idx + 1,
          "user_read.data->>'userId' = :userId",
          {
            userId: element,
          },
        );
      });
      expect(getRawOne).toBeCalledTimes(userIdList.length);
      expect(reconstituteRead).toBeCalledTimes(userIdList.length);
      mockUsers.forEach((element, idx) => {
        expect(reconstituteRead).toHaveBeenNthCalledWith(
          idx + 1,
          new CreateUserReadDto(
            element.data.userId,
            element.data.imgId,
            element.data.nickname,
            element.data.urlId,
            element.data.createdAt,
            element.data.updatedAt,
            element.data.deletedAt,
            element.data.balance,
            element.data.mbti,
            element.data.adjectiveExpressionList,
          ),
        );
      });
    });
  });

  describe('delete', () => {
    const userId = 1;

    it('유저를 삭제합니다.', async () => {
      const queryBuilder = manager.createQueryBuilder();
      jest.spyOn(manager, 'createQueryBuilder').mockReturnValue(queryBuilder);
      const delete2 = jest.spyOn(queryBuilder, 'delete');
      const from = jest.spyOn(queryBuilder, 'from');
      const where = jest.spyOn(queryBuilder, 'where');
      const execute = jest
        .spyOn(manager.createQueryBuilder(), 'execute')
        .mockResolvedValue({ affected: 1 });

      await repository.delete(userId, manager);

      expect(delete2).toBeCalledTimes(1);
      expect(from).toBeCalledTimes(1);
      expect(from).toBeCalledWith(UserReadEntity, 'user');
      expect(where).toBeCalledTimes(1);
      expect(where).toBeCalledWith("user.data->>'userId' = :userId", {
        userId,
      });
      expect(execute).toBeCalledTimes(1);
    });

    it('유저 삭제 실패 시 오류를 반환합니다.', async () => {
      const queryBuilder = manager.createQueryBuilder();
      jest.spyOn(manager, 'createQueryBuilder').mockReturnValue(queryBuilder);
      const execute = jest
        .spyOn(manager.createQueryBuilder(), 'execute')
        .mockResolvedValue({ affected: 0 });

      await expect(repository.delete(userId, manager)).rejects.toThrowError(
        new DeleteUserException(),
      );

      expect(execute).toBeCalledTimes(1);
    });
  });
});
