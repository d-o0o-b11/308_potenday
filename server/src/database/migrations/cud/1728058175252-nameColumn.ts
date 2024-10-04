import { MigrationInterface, QueryRunner } from 'typeorm';

export class NameColumn1728058175252 implements MigrationInterface {
  name = 'NameColumn1728058175252';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" RENAME COLUMN "nickname" TO "name"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" RENAME COLUMN "name" TO "nickname"`,
    );
  }
}
