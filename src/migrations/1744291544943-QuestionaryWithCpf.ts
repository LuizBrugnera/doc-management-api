import { MigrationInterface, QueryRunner } from "typeorm";

export class QuestionaryWithCpf1744291544943 implements MigrationInterface {
    name = 'QuestionaryWithCpf1744291544943'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`questionary\` ADD \`cpf\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`questionary\` DROP COLUMN \`cpf\``);
    }

}
