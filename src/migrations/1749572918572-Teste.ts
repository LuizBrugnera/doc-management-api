import { MigrationInterface, QueryRunner } from "typeorm";

export class Teste1749572918572 implements MigrationInterface {
    name = 'Teste1749572918572'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`os\` ADD \`atribuicao\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`service_data\` ADD \`atribuicao\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`service_data\` DROP COLUMN \`atribuicao\``);
        await queryRunner.query(`ALTER TABLE \`os\` DROP COLUMN \`atribuicao\``);
    }

}
