import { EntityManager, QueryRunner } from "typeorm";

export class MockDataSourceProvider {
  transaction;

  constructor() {
    this.transaction = jest.fn();
  }

  createQueryRunner(): QueryRunner {
    return {
      ...qr,
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
    };
  }

  createEntityManager(queryRunner?: QueryRunner): EntityManager {
    return queryRunner?.manager || qr.manager;
  }
}

export const qr = {
  manager: {},
} as QueryRunner;
