import { MigrationInterface, QueryRunner } from "typeorm";

export class AssignedDocument21748101681200 implements MigrationInterface {
    name = 'AssignedDocument21748101681200'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`assigned_document\` ADD \`os_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`assigned_document\` ADD \`document_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`assigned_document\` ADD UNIQUE INDEX \`IDX_36a657406410eefad1892986f0\` (\`document_id\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_36a657406410eefad1892986f0\` ON \`assigned_document\` (\`document_id\`)`);
        await queryRunner.query(`ALTER TABLE \`assigned_document\` ADD CONSTRAINT \`FK_0e946ec97da8d0581f44688a044\` FOREIGN KEY (\`os_id\`) REFERENCES \`os\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`assigned_document\` ADD CONSTRAINT \`FK_36a657406410eefad1892986f0a\` FOREIGN KEY (\`document_id\`) REFERENCES \`document\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`assigned_document\` DROP FOREIGN KEY \`FK_36a657406410eefad1892986f0a\``);
        await queryRunner.query(`ALTER TABLE \`assigned_document\` DROP FOREIGN KEY \`FK_0e946ec97da8d0581f44688a044\``);
        await queryRunner.query(`DROP INDEX \`REL_36a657406410eefad1892986f0\` ON \`assigned_document\``);
        await queryRunner.query(`ALTER TABLE \`assigned_document\` DROP INDEX \`IDX_36a657406410eefad1892986f0\``);
        await queryRunner.query(`ALTER TABLE \`assigned_document\` DROP COLUMN \`document_id\``);
        await queryRunner.query(`ALTER TABLE \`assigned_document\` DROP COLUMN \`os_id\``);
    }

}
