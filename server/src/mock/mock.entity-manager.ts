import { EntityManager } from 'typeorm';

export const MockEntityManager = (): EntityManager =>
  ({
    increment: jest.fn(),
    transaction: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    findOneOrFail: jest.fn(),
    findOneByOrFail: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    query: jest.fn(),
    insert: jest.fn(),
    count: jest.fn(),

    softDelete: jest.fn(),
    softRemove: jest.fn(),

    update: jest.fn(),
    getRepository: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue({
      innerJoin: jest.fn().mockReturnThis(),
      innerJoinAndSelect: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      leftJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orWhere: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockReturnThis(),
      execute: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      addOrderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockReturnThis(),
      whereInIds: jest.fn().mockReturnThis(),

      withDeleted: jest.fn().mockReturnThis(),
      getSql: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),

      /* with update */
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),

      /* with insert */
      insert: jest.fn().mockReturnThis(),
      into: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),

      distinctOn: jest.fn().mockReturnThis(),

      subQuery: jest.fn().mockReturnThis(),
      getQuery: jest.fn().mockReturnThis(),

      groupBy: jest.fn().mockReturnThis(),
      addGroupBy: jest.fn().mockReturnThis(),

      setParameters: jest.fn().mockReturnThis(),
      getParameters: jest.fn().mockReturnThis(),

      limit: jest.fn().mockReturnThis(),
    }),
  }) as any;
