import { MigrationInterface, QueryRunner } from "typeorm";

export class OsDescription1741886092162 implements MigrationInterface {
    name = 'OsDescription1741886092162'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`os\` ADD \`last_update\` datetime NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`os\` DROP COLUMN \`last_update\``);
    }

}
