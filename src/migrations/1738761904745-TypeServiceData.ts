import { MigrationInterface, QueryRunner } from "typeorm";

export class TypeServiceData1738761904745 implements MigrationInterface {
    name = 'TypeServiceData1738761904745'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`service_data\` ADD \`type\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`service_data\` DROP COLUMN \`type\``);
    }

}
