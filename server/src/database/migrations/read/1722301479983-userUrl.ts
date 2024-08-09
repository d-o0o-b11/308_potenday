import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserUrl1722301479983 implements MigrationInterface {
  name = 'UserUrl1722301479983';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "url" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "data" jsonb NOT NULL, CONSTRAINT "PK_7421088122ee64b55556dfc3a91" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "data" jsonb NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "url"`);
  }
}
