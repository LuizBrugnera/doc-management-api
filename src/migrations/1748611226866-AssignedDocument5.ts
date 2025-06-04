import { MigrationInterface, QueryRunner } from "typeorm";

export class AssignedDocument51748611226866 implements MigrationInterface {
    name = 'AssignedDocument51748611226866'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`assigned_document\` DROP COLUMN \`overall_status\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`assigned_document\` ADD \`overall_status\` varchar(255) NOT NULL`);
    }

}
