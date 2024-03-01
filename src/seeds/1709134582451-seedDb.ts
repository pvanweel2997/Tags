import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedsDb1709134582451 implements MigrationInterface {
  name = 'SeedsDb1709134582451';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO tags (name) VALUES('dragon'),('basketball'),('nestjs')`,
    );

    await queryRunner.query(
      // password is 'password'
      `INSERT INTO users (username, email, password) 
        VALUES(
          'pvanweel', 'pvanweel@yahoo.com', '$2b$10$cSx8icKTJdcD3pUHjAPLvuUIviiRt/M.FF6UloJjT67L7uzFcEU4q')`,
    );

    await queryRunner.query(
      `INSERT INTO articles (slug, title, description, body, taglist, "authorId") 
       VALUES ('first-article-slug',  'first article title', 'first article description', 'first article body','coffee,hello,reactjs',1),
              ('second-article-slug', 'second article title', 'second article description', 'second article body','dirt,mountain dew,taekwondo',1)`,
    );
  }

  public async down(): Promise<void> {}
}
