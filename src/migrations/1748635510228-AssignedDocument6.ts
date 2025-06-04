import { MigrationInterface, QueryRunner } from "typeorm";

export class AssignedDocument61748635510228 implements MigrationInterface {
    name = 'AssignedDocument61748635510228'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`assigned_document\` ADD \`historico\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`assigned_document\` DROP COLUMN \`historico\``);
    }

}
