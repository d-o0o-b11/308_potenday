import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';
import { MbtiFactory } from '@domain';
import {
  CreateMbtiReadDto,
  DeleteUserMbtiReadDto,
  FindSubmitMbtiUserDto,
  FindUserMbtiDto,
  UserMbtiRawDto,
} from '@application';
import {
  CreateMbtiException,
  DeleteMbtiException,
  NotFoundMbtiException,
} from '@common';
import { MbtiReadRepository } from '@infrastructure';
import { MockEntityManager } from '@mock';
import { UserReadEntity } from '@infrastructure/user/database/entity/read/user-read.entity';

describe('MbtiReadRepository', () => {
  let repository: MbtiReadRepository;
  let mbtiFactory: MbtiFactory;
  let manager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MbtiReadRepository,
        {
          provide: MbtiFactory,
          useValue: {
            reconstitute: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<MbtiReadRepository>(MbtiReadRepository);
    mbtiFactory = module.get<MbtiFactory>(MbtiFactory);
    manager = MockEntityManager();
  });

  it('IsDefined', () => {
    expect(repository).toBeDefined();
    expect(mbtiFactory).toBeDefined();
  });

  describe('create', () => {
    const dto: CreateMbtiReadDto = {
      mbtiId: 1,
      userId: 2,
      mbti: 'INTJ',
      toUserId: 126,
      createdAt: new Date(),
    };

    it('MBTI를 저장합니다.', async () => {
      const queryBuilder = manager.createQueryBuilder();
      jest.spyOn(manager, 'createQueryBuilder').mockReturnValue(queryBuilder);
      const update = jest.spyOn(queryBuilder, 'update');
      const set = jest.spyOn(queryBuilder, 'set' as any);
      const where = jest.spyOn(queryBuilder, 'where');
      const execute = jest
        .spyOn(queryBuilder, 'execute')
        .mockResolvedValue({ affected: 1 });

      await repository.create(dto, manager);

      expect(update).toBeCalledTimes(1);
      expect(update).toBeCalledWith(UserReadEntity);
      expect(set).toBeCalledTimes(1);
      expect(set).toBeCalledWith(
        expect.objectContaining({
          data: expect.any(Function),
        }),
      );
      expect(where).toBeCalledTimes(1);
      expect(where).toBeCalledWith("data->>'userId' = :userId", {
        userId: dto.userId,
      });
      expect(execute).toBeCalledTimes(1);
    });

    it('MBTI 저장 과정에서 오류 발생 시 에러를 반환합니다.', async () => {
      const queryBuilder = manager.createQueryBuilder();
      jest.spyOn(manager, 'createQueryBuilder').mockReturnValue(queryBuilder);

      const execute = jest
        .spyOn(queryBuilder, 'execute')
        .mockResolvedValue({ affected: 0 });

      await expect(repository.create(dto, manager)).rejects.toThrowError(
        new CreateMbtiException(),
      );
      expect(execute).toBeCalledTimes(1);
    });
  });

  describe('isSubmitUser', () => {
    const dto: FindSubmitMbtiUserDto = { userId: 126, toUserId: 127 };

    it('MBTI 배열 내에 toUserId가 일치하는 항목이 있을 경우 true를 반환합니다.', async () => {
      const queryBuilder = manager.createQueryBuilder();
      jest.spyOn(manager, 'createQueryBuilder').mockReturnValue(queryBuilder);
      const select = jest.spyOn(queryBuilder, 'select');
      const where = jest.spyOn(queryBuilder, 'where');
      const getRawOne = jest
        .spyOn(queryBuilder, 'getRawOne')
        .mockResolvedValue({
          mbti: [{ toUserId: 127, mbti: 'INTJ' }],
        });

      const result = await repository.isSubmitUser(dto, manager);

      expect(select).toBeCalledTimes(1);
      expect(select).toBeCalledWith("data->'mbti' AS mbti");
      expect(where).toBeCalledTimes(1);
      expect(where).toBeCalledWith("data->>'userId' = :userId", {
        userId: dto.userId,
      });
      expect(getRawOne).toBeCalledTimes(1);
      expect(result).toBe(true);
    });

    it('MBTI 배열 내에 toUserId가 일치하는 항목이 없을 경우 false를 반환합니다.', async () => {
      const queryBuilder = manager.createQueryBuilder();
      jest.spyOn(manager, 'createQueryBuilder').mockReturnValue(queryBuilder);
      const getRawOne = jest
        .spyOn(queryBuilder, 'getRawOne')
        .mockResolvedValueOnce({
          mbti: [{ toUserId: 3, mbti: 'INTJ' }],
        });

      const result = await repository.isSubmitUser(dto, manager);

      expect(getRawOne).toBeCalledTimes(1);
      expect(result).toBe(false);
    });

    it('MBTI 배열이 없을 경우 false를 반환합니다.', async () => {
      const queryBuilder = manager.createQueryBuilder();
      jest.spyOn(manager, 'createQueryBuilder').mockReturnValue(queryBuilder);
      const getRawOne = jest.spyOn(queryBuilder, 'getRawOne');

      const result = await repository.isSubmitUser(dto, manager);

      expect(getRawOne).toBeCalledTimes(1);
      expect(result).toBe(false);
    });
  });

  describe('findUserCount', () => {
    const dto: FindUserMbtiDto = { urlId: 1, toUserId: 2 };

    it('MBTI를 제출한 유저의 인원 수를 확인합니다.', async () => {
      const queryBuilder = manager.createQueryBuilder();
      jest.spyOn(manager, 'createQueryBuilder').mockReturnValue(queryBuilder);
      const select = jest.spyOn(queryBuilder, 'select');
      const where = jest.spyOn(queryBuilder, 'where');
      const andWhere = jest.spyOn(queryBuilder, 'andWhere');
      const getRawOne = jest
        .spyOn(queryBuilder, 'getRawOne')
        .mockResolvedValueOnce({
          count: '5',
        });

      const result = await repository.findUserCount(dto, manager);

      expect(select).toBeCalledTimes(1);
      expect(select).toBeCalledWith('COUNT(*)', 'count');
      expect(where).toBeCalledTimes(1);
      expect(where).toBeCalledWith("data->>'urlId' = :urlId", {
        urlId: dto.urlId,
      });
      expect(andWhere).toBeCalledTimes(2);
      expect(andWhere).toHaveBeenNthCalledWith(1, "data->'mbti' IS NOT NULL");
      expect(andWhere).toHaveBeenNthCalledWith(
        2,
        `
        EXISTS (
          SELECT 1
          FROM jsonb_array_elements(data->'mbti') AS mbti
          WHERE mbti->>'toUserId' = :toUserId
        )
      `,
        { toUserId: dto.toUserId },
      );
      expect(getRawOne).toBeCalledTimes(1);
      expect(result.count).toBe('5');
    });
  });

  describe('find', () => {
    const urlId = 111;
    const getResult = [
      {
        user_id: 1,
        nick_name: 'd_o0o_b',
        img_id: 2,
        mbti_list: [{ mbti: 'INTJ', toUserId: 1 }],
      },
      {
        user_id: 2,
        nick_name: 'd_o0o_b2',
        img_id: 2,
        mbti_list: [{ mbti: 'INTJ', toUserId: 2 }],
      },
    ];

    it('url에 속한 유저들의 MBTI를 조회합니다.', async () => {
      const queryBuilder = manager.createQueryBuilder();
      jest.spyOn(manager, 'createQueryBuilder').mockReturnValue(queryBuilder);
      const select = jest.spyOn(queryBuilder, 'select');
      const where = jest.spyOn(queryBuilder, 'where');
      const getRawMany = jest
        .spyOn(queryBuilder, 'getRawMany')
        .mockResolvedValueOnce(getResult);
      const reconstitute = jest.spyOn(mbtiFactory, 'reconstitute');

      await repository.find(urlId, manager);

      expect(select).toBeCalledTimes(1);
      expect(select).toBeCalledWith([
        "data->'userId' AS user_id",
        "data->'nickname' AS nick_name",
        "data->'imgId' AS img_id",
        "data->'mbti' AS mbti_list",
      ]);
      expect(where).toBeCalledTimes(1);
      expect(where).toBeCalledWith("data->>'urlId' = :urlId", { urlId });
      expect(getRawMany).toBeCalledTimes(1);
      expect(reconstitute).toBeCalledTimes(2);
      getResult.forEach((element, idx) => {
        expect(reconstitute).toHaveBeenNthCalledWith(
          idx + 1,
          new UserMbtiRawDto(
            null,
            element.user_id,
            element.mbti_list[0].mbti ?? null,
            null,
            element.nick_name,
            element.img_id,
          ),
        );
      });
    });
  });

  describe('findSubmitList', () => {
    const dto: FindUserMbtiDto = { urlId: 111, toUserId: 2 };
    const getResult = [
      {
        user_id: 1,
        nick_name: 'd_o0o_b',
        img_id: 1,
        mbti_list: [{ toUserId: 2, mbti: 'INTJ' }],
      },
      {
        user_id: 2,
        nick_name: 'd_o0o_b2',
        img_id: 4,
        mbti_list: [{ toUserId: 2, mbti: 'ENFP' }],
      },
    ];

    it('매칭되는 MBTI 리스트를 반환합니다.', async () => {
      const queryBuilder = manager.createQueryBuilder();
      jest.spyOn(manager, 'createQueryBuilder').mockReturnValue(queryBuilder);

      const select = jest
        .spyOn(queryBuilder, 'select')
        .mockReturnValue(queryBuilder);
      const where = jest
        .spyOn(queryBuilder, 'where')
        .mockReturnValue(queryBuilder);
      const andWhere = jest
        .spyOn(queryBuilder, 'andWhere')
        .mockReturnValue(queryBuilder);
      const getRawMany = jest
        .spyOn(queryBuilder, 'getRawMany')
        .mockResolvedValue(getResult);

      const reconstitute = jest.spyOn(mbtiFactory, 'reconstitute');

      await repository.findSubmitList(dto, manager);

      expect(select).toBeCalledWith([
        "data->'userId' AS user_id",
        "data->'nickname' AS nick_name",
        "data->'imgId' AS img_id",
        "data->'mbti' AS mbti_list",
      ]);
      expect(where).toBeCalledWith("data->>'urlId' = :urlId", {
        urlId: dto.urlId,
      });
      expect(andWhere).toBeCalledTimes(1);
      expect(getRawMany).toBeCalledTimes(1);

      expect(reconstitute).toHaveBeenCalledTimes(2);
      getResult.forEach((element, idx) => {
        expect(reconstitute).toHaveBeenNthCalledWith(
          idx + 1,
          new UserMbtiRawDto(
            null,
            element.user_id,
            element.mbti_list[0].mbti,
            dto.toUserId,
            element.nick_name,
            element.img_id,
          ),
        );
      });
    });
  });

  describe('delete', () => {
    const dto: DeleteUserMbtiReadDto = { mbtiId: 1, userId: 126 };

    it('MBTI를 삭제합니다.', async () => {
      const queryBuilder = manager.createQueryBuilder();
      jest.spyOn(manager, 'createQueryBuilder').mockReturnValue(queryBuilder);
      const select = jest.spyOn(queryBuilder, 'select');
      const where = jest.spyOn(queryBuilder, 'where');
      const update = jest.spyOn(queryBuilder, 'update');
      const set = jest.spyOn(queryBuilder, 'set' as any);
      const getRawOne = jest
        .spyOn(queryBuilder, 'getRawOne')
        .mockResolvedValueOnce({
          mbti: [{ mbtiId: 1, mbti: 'INTJ' }],
        });
      const execute = jest
        .spyOn(queryBuilder, 'execute')
        .mockResolvedValueOnce({
          affected: 1,
        });

      await repository.delete(dto, manager);

      expect(select).toBeCalledTimes(1);
      expect(select).toBeCalledWith("user.data->'mbti' AS mbti");
      expect(where).toBeCalledTimes(2);
      expect(where).toHaveBeenNthCalledWith(
        1,
        "user.data->>'userId' = :userId",
        {
          userId: dto.userId,
        },
      );
      expect(where).toHaveBeenNthCalledWith(2, "data->>'userId' = :userId", {
        userId: dto.userId,
      });
      expect(update).toBeCalledTimes(1);
      expect(update).toBeCalledWith(UserReadEntity);
      expect(set).toBeCalledTimes(1);
      expect(set).toBeCalledWith(
        expect.objectContaining({
          data: expect.any(Function),
        }),
      );
      expect(getRawOne).toBeCalledTimes(1);
      expect(execute).toBeCalledTimes(1);
    });

    it('MBTI 배열이 없을 경우 오류를 반환합니다.', async () => {
      const queryBuilder = manager.createQueryBuilder();
      jest.spyOn(manager, 'createQueryBuilder').mockReturnValue(queryBuilder);
      const getRawOne = jest.spyOn(queryBuilder, 'getRawOne');

      await expect(repository.delete(dto, manager)).rejects.toThrowError(
        new NotFoundMbtiException(),
      );

      expect(getRawOne).toBeCalledTimes(1);
    });

    it('MBTI 삭제 시 에러가 발생할 경우 오류를 반환합니다.', async () => {
      const queryBuilder = manager.createQueryBuilder();
      jest.spyOn(manager, 'createQueryBuilder').mockReturnValue(queryBuilder);
      const getRawOne = jest
        .spyOn(queryBuilder, 'getRawOne')
        .mockResolvedValueOnce({
          mbti: [{ mbtiId: 1, mbti: 'INTJ' }],
        });
      const execute = jest
        .spyOn(queryBuilder, 'execute')
        .mockResolvedValueOnce({
          affected: 0,
        });

      await expect(repository.delete(dto, manager)).rejects.toThrowError(
        new DeleteMbtiException(),
      );

      expect(getRawOne).toBeCalledTimes(1);
      expect(execute).toBeCalledTimes(1);
    });
  });
});
