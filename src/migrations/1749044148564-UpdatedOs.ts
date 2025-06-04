import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedOs1749044148564 implements MigrationInterface {
    name = 'UpdatedOs1749044148564'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`os\` ADD \`documentos_os\` varchar(255) NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`os\` DROP COLUMN \`documentos_os\``);
    }

}
