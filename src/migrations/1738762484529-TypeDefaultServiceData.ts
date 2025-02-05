import { MigrationInterface, QueryRunner } from "typeorm";

export class TypeDefaultServiceData1738762484529 implements MigrationInterface {
    name = 'TypeDefaultServiceData1738762484529'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`service_data\` CHANGE \`type\` \`type\` varchar(255) NOT NULL DEFAULT 'page'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`service_data\` CHANGE \`type\` \`type\` varchar(255) NULL`);
    }

}
