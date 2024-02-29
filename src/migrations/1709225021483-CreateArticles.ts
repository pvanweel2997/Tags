import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateArticles1709225021483 implements MigrationInterface {
  name = 'CreateArticles1709225021483';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "articles" ("id" SERIAL NOT NULL, "slug" character varying NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL DEFAULT '', "body" character varying NOT NULL DEFAULT '', "createdat" TIMESTAMP NOT NULL DEFAULT now(), "updatedat" TIMESTAMP NOT NULL DEFAULT now(), "taglist" text NOT NULL, "favoritescount" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_0a6e2c450d83e0b6052c2793334" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "articles"`);
  }
}
