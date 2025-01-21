import { MigrationInterface, QueryRunner } from "typeorm";

export class Hash1737481195945 implements MigrationInterface {
    name = 'Hash1737481195945'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`os\` ADD \`hash\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`os\` DROP COLUMN \`hash\``);
    }

}
