import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProductsTable1790027629064 implements MigrationInterface {
    name = 'AddProductsTable1790027629064'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."tables_status_enum" AS ENUM('AVAILABLE', 'OCCUPIED', 'OUT_OF_SERVICE')`);
        await queryRunner.query(`CREATE TABLE "tables" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "number" integer NOT NULL, "capacity" integer NOT NULL, "zone" character varying(50) NOT NULL, "status" "public"."tables_status_enum" NOT NULL DEFAULT 'AVAILABLE', CONSTRAINT "UQ_0aa8f1290718849823b581ec144" UNIQUE ("number"), CONSTRAINT "PK_7cf2aca7af9550742f855d4eb69" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."categories_status_enum" AS ENUM('ACTIVE', 'INACTIVE')`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(60) NOT NULL, "description" character varying(255), "status" "public"."categories_status_enum" NOT NULL DEFAULT 'ACTIVE', CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."products_status_enum" AS ENUM('ACTIVE', 'INACTIVE')`);
        await queryRunner.query(`CREATE TYPE "public"."products_availability_enum" AS ENUM('AVAILABLE', 'UNAVAILABLE')`);
        await queryRunner.query(`CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "description" character varying(255), "price" numeric(10,2) NOT NULL, "status" "public"."products_status_enum" NOT NULL DEFAULT 'ACTIVE', "availability" "public"."products_availability_enum" NOT NULL DEFAULT 'AVAILABLE', "categoryId" uuid NOT NULL, CONSTRAINT "CHK_ba339f178553051542254ef21d" CHECK ("price" > 0), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_ff56834e735fa78a15d0cf21926" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_ff56834e735fa78a15d0cf21926"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TYPE "public"."products_availability_enum"`);
        await queryRunner.query(`DROP TYPE "public"."products_status_enum"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TYPE "public"."categories_status_enum"`);
        await queryRunner.query(`DROP TABLE "tables"`);
        await queryRunner.query(`DROP TYPE "public"."tables_status_enum"`);
    }

}
