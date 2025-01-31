import { MigrationInterface, QueryRunner } from "typeorm";

export class ScheduleAndDoc1738161306610 implements MigrationInterface {
    name = 'ScheduleAndDoc1738161306610'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`os\` ADD \`scheduled_date\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`os\` ADD \`local\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`os\` ADD \`document_id\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`os\` DROP COLUMN \`document_id\``);
        await queryRunner.query(`ALTER TABLE \`os\` DROP COLUMN \`local\``);
        await queryRunner.query(`ALTER TABLE \`os\` DROP COLUMN \`scheduled_date\``);
    }

}
