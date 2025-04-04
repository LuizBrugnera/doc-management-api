import { MigrationInterface, QueryRunner } from "typeorm";

export class EmailTemplate21743776982066 implements MigrationInterface {
    name = 'EmailTemplate21743776982066'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`admin\` DROP COLUMN \`email_template\``);
        await queryRunner.query(`ALTER TABLE \`department\` DROP COLUMN \`email_template\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`department\` ADD \`email_template\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`admin\` ADD \`email_template\` text NULL`);
    }

}
