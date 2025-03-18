import { MigrationInterface, QueryRunner } from "typeorm";

export class LastLogin1742330341192 implements MigrationInterface {
    name = 'LastLogin1742330341192'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`last_login\` datetime NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`last_login\``);
    }

}
