import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTablesZoneLength1789691554896 implements MigrationInterface {
  name = 'AlterTablesZoneLength1789691554896';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tables" ALTER COLUMN "zone" TYPE character varying(50)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tables" ALTER COLUMN "zone" TYPE character varying`,
    );
  }
}
