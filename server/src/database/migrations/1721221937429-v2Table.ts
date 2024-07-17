import { MigrationInterface, QueryRunner } from 'typeorm';

export class V2Table1721221937429 implements MigrationInterface {
  name = 'V2Table1721221937429';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "event_log" ("id" SERIAL NOT NULL, "aggregateId" character varying NOT NULL, "type" character varying NOT NULL, "payload" json NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d8ccd9b5b44828ea378dd37e691" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "common_question" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "common_question" DROP COLUMN "updateAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "common_question" DROP COLUMN "deleteAt"`,
    );
    await queryRunner.query(`ALTER TABLE "user_url" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "user_url" DROP COLUMN "updateAt"`);
    await queryRunner.query(`ALTER TABLE "user_url" DROP COLUMN "deleteAt"`);
    await queryRunner.query(
      `ALTER TABLE "user_balance" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_balance" DROP COLUMN "updateAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_balance" DROP COLUMN "deleteAt"`,
    );
    await queryRunner.query(`ALTER TABLE "user_mbti" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "user_mbti" DROP COLUMN "updateAt"`);
    await queryRunner.query(`ALTER TABLE "user_mbti" DROP COLUMN "deleteAt"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updateAt"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deleteAt"`);
    await queryRunner.query(
      `ALTER TABLE "user_adjective_expression" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_adjective_expression" DROP COLUMN "updateAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_adjective_expression" DROP COLUMN "deleteAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "common_question" ADD "created_at" date NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "common_question" ADD "update_at" date NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "common_question" ADD "delete_at" date`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_url" ADD "created_at" date NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_url" ADD "update_at" date NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "user_url" ADD "delete_at" date`);
    await queryRunner.query(
      `ALTER TABLE "user_balance" ADD "created_at" date NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_balance" ADD "update_at" date NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "user_balance" ADD "delete_at" date`);
    await queryRunner.query(
      `ALTER TABLE "user_mbti" ADD "created_at" date NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_mbti" ADD "update_at" date NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "user_mbti" ADD "delete_at" date`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "created_at" date NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "update_at" date NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "delete_at" date`);
    await queryRunner.query(
      `ALTER TABLE "user_adjective_expression" ADD "created_at" date NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_adjective_expression" ADD "update_at" date NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_adjective_expression" ADD "delete_at" date`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_adjective_expression" DROP COLUMN "delete_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_adjective_expression" DROP COLUMN "update_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_adjective_expression" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "delete_at"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "update_at"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "created_at"`);
    await queryRunner.query(`ALTER TABLE "user_mbti" DROP COLUMN "delete_at"`);
    await queryRunner.query(`ALTER TABLE "user_mbti" DROP COLUMN "update_at"`);
    await queryRunner.query(`ALTER TABLE "user_mbti" DROP COLUMN "created_at"`);
    await queryRunner.query(
      `ALTER TABLE "user_balance" DROP COLUMN "delete_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_balance" DROP COLUMN "update_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_balance" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(`ALTER TABLE "user_url" DROP COLUMN "delete_at"`);
    await queryRunner.query(`ALTER TABLE "user_url" DROP COLUMN "update_at"`);
    await queryRunner.query(`ALTER TABLE "user_url" DROP COLUMN "created_at"`);
    await queryRunner.query(
      `ALTER TABLE "common_question" DROP COLUMN "delete_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "common_question" DROP COLUMN "update_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "common_question" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_adjective_expression" ADD "deleteAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_adjective_expression" ADD "updateAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_adjective_expression" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "deleteAt" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "updateAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "user_mbti" ADD "deleteAt" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "user_mbti" ADD "updateAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_mbti" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_balance" ADD "deleteAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_balance" ADD "updateAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_balance" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "user_url" ADD "deleteAt" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "user_url" ADD "updateAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_url" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "common_question" ADD "deleteAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "common_question" ADD "updateAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "common_question" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`DROP TABLE "event_log"`);
  }
}
