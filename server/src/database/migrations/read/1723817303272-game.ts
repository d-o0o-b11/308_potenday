import { MigrationInterface, QueryRunner } from 'typeorm';

export class Game1723817303272 implements MigrationInterface {
  name = 'Game1723817303272';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "common_question" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "question_1" boolean NOT NULL DEFAULT false, "question_2" boolean NOT NULL DEFAULT false, "question_3" boolean NOT NULL DEFAULT false, "question_4" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_a7704d98d5a88d02f6e59178c24" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "adjective_expression" ("id" SERIAL NOT NULL, "adjective" character varying NOT NULL, CONSTRAINT "PK_b676dfd7054a490a24b0bcbf539" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "balance_list" ("id" SERIAL NOT NULL, "type_A" character varying NOT NULL, "type_B" character varying NOT NULL, CONSTRAINT "PK_c4eafbef66995e0f9e0b4f2cbe9" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "balance_list"`);
    await queryRunner.query(`DROP TABLE "adjective_expression"`);
    await queryRunner.query(`DROP TABLE "common_question"`);
  }
}
