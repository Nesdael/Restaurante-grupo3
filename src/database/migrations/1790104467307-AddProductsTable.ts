import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductsTable1790104467307 implements MigrationInterface {
  name = 'AddProductsTable1790104467307';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."products_status_enum" AS ENUM('ACTIVE', 'INACTIVE')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."products_availability_enum" AS ENUM('AVAILABLE', 'UNAVAILABLE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "description" character varying(255), "price" numeric(10,2) NOT NULL, "status" "public"."products_status_enum" NOT NULL DEFAULT 'ACTIVE', "availability" "public"."products_availability_enum" NOT NULL DEFAULT 'AVAILABLE', "categoryId" uuid NOT NULL, CONSTRAINT "CHK_ba339f178553051542254ef21d" CHECK ("price" > 0), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "FK_ff56834e735fa78a15d0cf21926" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "FK_ff56834e735fa78a15d0cf21926"`,
    );
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(`DROP TYPE "public"."products_availability_enum"`);
    await queryRunner.query(`DROP TYPE "public"."products_status_enum"`);
  }
}
