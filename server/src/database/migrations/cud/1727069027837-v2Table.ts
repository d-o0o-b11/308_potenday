import { MigrationInterface, QueryRunner } from 'typeorm';

export class V2Table1727069027837 implements MigrationInterface {
  name = 'V2Table1727069027837';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_adjective_expression" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "user_id" integer NOT NULL, "adjective_expression_id" integer NOT NULL, CONSTRAINT "PK_8ddee23da43308f9fe5fd50a5d6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "adjective_expression" ("id" SERIAL NOT NULL, "adjective" character varying NOT NULL, CONSTRAINT "PK_b676dfd7054a490a24b0bcbf539" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_balance" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "user_id" integer NOT NULL, "balance_id" integer NOT NULL, "balance_type" character varying NOT NULL, CONSTRAINT "PK_f3edf5a1907e7b430421b9c2ddd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "balance_list" ("id" SERIAL NOT NULL, "type_A" character varying NOT NULL, "type_B" character varying NOT NULL, CONSTRAINT "PK_c4eafbef66995e0f9e0b4f2cbe9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "img_id" integer NOT NULL, "nickname" character varying NOT NULL, "url_id" integer NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_url" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "url" character varying NOT NULL, "status" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_8644584d3620c8fd95111270b75" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "event_log" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, "method" character varying NOT NULL, "event" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d8ccd9b5b44828ea378dd37e691" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_mbti" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "user_id" integer NOT NULL, "mbti" character varying, "to_user_id" integer NOT NULL, CONSTRAINT "PK_8a54e7df9e49d9092e6759c020a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_adjective_expression" ADD CONSTRAINT "FK_8daa341e29b259b480dfe2c06a6" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_adjective_expression" ADD CONSTRAINT "FK_4ef92c73750787b4fb0a87dfa32" FOREIGN KEY ("adjective_expression_id") REFERENCES "adjective_expression"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_balance" ADD CONSTRAINT "FK_8fdba3bca96f8af1a318a6e25db" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_balance" ADD CONSTRAINT "FK_4afc57155c723bda149af7d8199" FOREIGN KEY ("balance_id") REFERENCES "balance_list"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_8644584d3620c8fd95111270b75" FOREIGN KEY ("url_id") REFERENCES "user_url"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_mbti" ADD CONSTRAINT "FK_552dae6e418cf99bfaf6677018d" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_mbti" ADD CONSTRAINT "FK_d36679575595c51182a9a5fa649" FOREIGN KEY ("to_user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_mbti" DROP CONSTRAINT "FK_d36679575595c51182a9a5fa649"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_mbti" DROP CONSTRAINT "FK_552dae6e418cf99bfaf6677018d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_8644584d3620c8fd95111270b75"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_balance" DROP CONSTRAINT "FK_4afc57155c723bda149af7d8199"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_balance" DROP CONSTRAINT "FK_8fdba3bca96f8af1a318a6e25db"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_adjective_expression" DROP CONSTRAINT "FK_4ef92c73750787b4fb0a87dfa32"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_adjective_expression" DROP CONSTRAINT "FK_8daa341e29b259b480dfe2c06a6"`,
    );
    await queryRunner.query(`DROP TABLE "user_mbti"`);
    await queryRunner.query(`DROP TABLE "event_log"`);
    await queryRunner.query(`DROP TABLE "user_url"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "balance_list"`);
    await queryRunner.query(`DROP TABLE "user_balance"`);
    await queryRunner.query(`DROP TABLE "adjective_expression"`);
    await queryRunner.query(`DROP TABLE "user_adjective_expression"`);
  }
}
