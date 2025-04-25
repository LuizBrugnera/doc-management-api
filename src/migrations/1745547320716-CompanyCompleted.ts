import { MigrationInterface, QueryRunner } from "typeorm";

export class CompanyCompleted1745547320716 implements MigrationInterface {
    name = 'CompanyCompleted1745547320716'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`company\` ADD \`completed\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`company\` DROP COLUMN \`completed\``);
    }

}
