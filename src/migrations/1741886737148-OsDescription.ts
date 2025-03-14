import { MigrationInterface, QueryRunner } from "typeorm";

export class OsDescription1741886737148 implements MigrationInterface {
    name = 'OsDescription1741886737148'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`os\` DROP COLUMN \`last_update\``);
        await queryRunner.query(`ALTER TABLE \`os\` ADD \`last_update\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`os\` DROP COLUMN \`last_update\``);
        await queryRunner.query(`ALTER TABLE \`os\` ADD \`last_update\` datetime NULL`);
    }

}
