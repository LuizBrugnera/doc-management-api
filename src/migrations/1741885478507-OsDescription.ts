import { MigrationInterface, QueryRunner } from "typeorm";

export class OsDescription1741885478507 implements MigrationInterface {
    name = 'OsDescription1741885478507'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`os\` ADD \`description\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`os\` DROP COLUMN \`description\``);
    }

}
