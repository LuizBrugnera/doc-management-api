import { MigrationInterface, QueryRunner } from "typeorm";

export class QuestionAndSubQuestions1745938175460 implements MigrationInterface {
    name = 'QuestionAndSubQuestions1745938175460'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`question\` (\`id\` int NOT NULL AUTO_INCREMENT, \`question_id\` int NOT NULL, \`title\` varchar(255) NOT NULL, \`risk_title\` varchar(255) NOT NULL, \`main_question\` varchar(255) NOT NULL, \`severity\` int NOT NULL, \`agente\` varchar(255) NOT NULL, \`definicao_do_perigo\` varchar(255) NOT NULL, \`possiveis_lesoes\` varchar(255) NOT NULL, \`circunstancias\` varchar(255) NOT NULL, \`severidade_descricao\` varchar(255) NOT NULL, \`plano_acao\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`sub_question\` (\`id\` int NOT NULL AUTO_INCREMENT, \`text\` varchar(255) NOT NULL, \`question_id\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`sub_question\` ADD CONSTRAINT \`FK_b99e5c8c307b2454393a1c64bc7\` FOREIGN KEY (\`question_id\`) REFERENCES \`question\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sub_question\` DROP FOREIGN KEY \`FK_b99e5c8c307b2454393a1c64bc7\``);
        await queryRunner.query(`DROP TABLE \`sub_question\``);
        await queryRunner.query(`DROP TABLE \`question\``);
    }

}
