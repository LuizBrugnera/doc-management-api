import { MigrationInterface, QueryRunner } from "typeorm";

export class QuestionAndSubQuestions1746109384401 implements MigrationInterface {
    name = 'QuestionAndSubQuestions1746109384401'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`question\` DROP COLUMN \`main_question\``);
        await queryRunner.query(`ALTER TABLE \`question\` ADD \`main_question\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`question\` DROP COLUMN \`agente\``);
        await queryRunner.query(`ALTER TABLE \`question\` ADD \`agente\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`question\` DROP COLUMN \`definicao_do_perigo\``);
        await queryRunner.query(`ALTER TABLE \`question\` ADD \`definicao_do_perigo\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`question\` DROP COLUMN \`possiveis_lesoes\``);
        await queryRunner.query(`ALTER TABLE \`question\` ADD \`possiveis_lesoes\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`question\` DROP COLUMN \`circunstancias\``);
        await queryRunner.query(`ALTER TABLE \`question\` ADD \`circunstancias\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`question\` DROP COLUMN \`severidade_descricao\``);
        await queryRunner.query(`ALTER TABLE \`question\` ADD \`severidade_descricao\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`question\` DROP COLUMN \`plano_acao\``);
        await queryRunner.query(`ALTER TABLE \`question\` ADD \`plano_acao\` text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`question\` DROP COLUMN \`plano_acao\``);
        await queryRunner.query(`ALTER TABLE \`question\` ADD \`plano_acao\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`question\` DROP COLUMN \`severidade_descricao\``);
        await queryRunner.query(`ALTER TABLE \`question\` ADD \`severidade_descricao\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`question\` DROP COLUMN \`circunstancias\``);
        await queryRunner.query(`ALTER TABLE \`question\` ADD \`circunstancias\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`question\` DROP COLUMN \`possiveis_lesoes\``);
        await queryRunner.query(`ALTER TABLE \`question\` ADD \`possiveis_lesoes\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`question\` DROP COLUMN \`definicao_do_perigo\``);
        await queryRunner.query(`ALTER TABLE \`question\` ADD \`definicao_do_perigo\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`question\` DROP COLUMN \`agente\``);
        await queryRunner.query(`ALTER TABLE \`question\` ADD \`agente\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`question\` DROP COLUMN \`main_question\``);
        await queryRunner.query(`ALTER TABLE \`question\` ADD \`main_question\` varchar(255) NOT NULL`);
    }

}
