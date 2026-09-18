import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCategoriesTable1789700000000 implements MigrationInterface {
  name = 'AddCategoriesTable1789700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."categories_status_enum" AS ENUM('ACTIVE', 'INACTIVE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "categories" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(60) NOT NULL,
        "description" character varying(255),
        "status" "public"."categories_status_enum" NOT NULL DEFAULT 'ACTIVE',
        CONSTRAINT "UQ_categories_name" UNIQUE ("name"),
        CONSTRAINT "PK_categories" PRIMARY KEY ("id")
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(`DROP TYPE "public"."categories_status_enum"`);
  }
}
