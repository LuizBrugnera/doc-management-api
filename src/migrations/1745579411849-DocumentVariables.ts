import { MigrationInterface, QueryRunner } from "typeorm";

export class DocumentVariables1745579411849 implements MigrationInterface {
    name = 'DocumentVariables1745579411849'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document\` ADD \`total_files\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`document\` ADD \`hash\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`document\` ADD \`position\` int NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document\` DROP COLUMN \`position\``);
        await queryRunner.query(`ALTER TABLE \`document\` DROP COLUMN \`hash\``);
        await queryRunner.query(`ALTER TABLE \`document\` DROP COLUMN \`total_files\``);
    }

}
