import { MigrationInterface, QueryRunner } from "typeorm";

export class Text1737124357316 implements MigrationInterface {
    name = 'Text1737124357316'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`service_data\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`service_data\` ADD \`description\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`service_data\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`service_data\` ADD \`description\` varchar(255) NULL`);
    }

}
