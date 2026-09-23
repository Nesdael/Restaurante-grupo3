import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddReservationsTable1790190134741 implements MigrationInterface {
  name = 'AddReservationsTable1790190134741';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."reservations_status_enum" AS ENUM('PENDING', 'CONFIRMED', 'CHECKED_IN', 'CANCELLED', 'NO_SHOW', 'COMPLETED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "reservations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "customerName" character varying(100) NOT NULL, "phone" character varying(20) NOT NULL, "email" character varying(150) NOT NULL, "guests" integer NOT NULL, "startsAt" TIMESTAMP WITH TIME ZONE NOT NULL, "endsAt" TIMESTAMP WITH TIME ZONE NOT NULL, "status" "public"."reservations_status_enum" NOT NULL DEFAULT 'PENDING', "tableId" uuid NOT NULL, "confirmedAt" TIMESTAMP WITH TIME ZONE, "checkedInAt" TIMESTAMP WITH TIME ZONE, "cancelledAt" TIMESTAMP WITH TIME ZONE, "noShowAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_da95cef71b617ac35dc5bcda243" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservations" ADD CONSTRAINT "FK_42ee40914a466cb26141c81e878" FOREIGN KEY ("tableId") REFERENCES "tables"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reservations" DROP CONSTRAINT "FK_42ee40914a466cb26141c81e878"`,
    );
    await queryRunner.query(`DROP TABLE "reservations"`);
    await queryRunner.query(`DROP TYPE "public"."reservations_status_enum"`);
  }
}
