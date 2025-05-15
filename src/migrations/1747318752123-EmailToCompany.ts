import { MigrationInterface, QueryRunner } from "typeorm";

export class EmailToCompany1747318752123 implements MigrationInterface {
    name = 'EmailToCompany1747318752123'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`company\` ADD \`email\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`company\` DROP COLUMN \`email\``);
    }

}
