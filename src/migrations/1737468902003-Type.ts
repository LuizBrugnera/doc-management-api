import { MigrationInterface, QueryRunner } from "typeorm";

export class Type1737468902003 implements MigrationInterface {
    name = 'Type1737468902003'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`os\` ADD \`type\` varchar(255) NOT NULL DEFAULT 'page'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`os\` DROP COLUMN \`type\``);
    }

}
