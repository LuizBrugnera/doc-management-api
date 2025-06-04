import { MigrationInterface, QueryRunner } from "typeorm";

export class AssignedDocument31748450826837 implements MigrationInterface {
    name = 'AssignedDocument31748450826837'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_36a657406410eefad1892986f0\` ON \`assigned_document\``);
        await queryRunner.query(`ALTER TABLE \`assigned_document\` ADD \`overall_status\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`assigned_document\` DROP COLUMN \`overall_status\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_36a657406410eefad1892986f0\` ON \`assigned_document\` (\`document_id\`)`);
    }

}
