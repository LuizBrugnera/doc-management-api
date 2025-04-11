import { MigrationInterface, QueryRunner } from "typeorm";

export class QuestionaryWithHash1744380272051 implements MigrationInterface {
    name = 'QuestionaryWithHash1744380272051'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`questionary\` ADD \`email\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`questionary\` ADD \`hash\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`questionary\` DROP COLUMN \`hash\``);
        await queryRunner.query(`ALTER TABLE \`questionary\` DROP COLUMN \`email\``);
    }

}
