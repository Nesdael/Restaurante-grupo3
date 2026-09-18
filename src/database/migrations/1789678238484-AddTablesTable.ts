import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTablesTable1789678238484 implements MigrationInterface {
    name = 'AddTablesTable1789678238484'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."tables_status_enum" AS ENUM('AVAILABLE', 'OCCUPIED', 'OUT_OF_SERVICE')`);
        await queryRunner.query(`CREATE TABLE "tables" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "number" integer NOT NULL, "capacity" integer NOT NULL, "zone" character varying NOT NULL, "status" "public"."tables_status_enum" NOT NULL DEFAULT 'AVAILABLE', CONSTRAINT "UQ_0aa8f1290718849823b581ec144" UNIQUE ("number"), CONSTRAINT "PK_7cf2aca7af9550742f855d4eb69" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tables"`);
        await queryRunner.query(`DROP TYPE "public"."tables_status_enum"`);
    }

}
