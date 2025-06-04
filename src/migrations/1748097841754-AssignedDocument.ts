import { MigrationInterface, QueryRunner } from "typeorm";

export class AssignedDocument1748097841754 implements MigrationInterface {
    name = 'AssignedDocument1748097841754'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`assigned_document\` (\`id\` int NOT NULL AUTO_INCREMENT, \`cod\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`type\` varchar(255) NOT NULL, \`cnpj\` varchar(255) NOT NULL, \`pgr\` varchar(255) NOT NULL, \`pcmso\` varchar(255) NOT NULL, \`ltcat\` varchar(255) NOT NULL, \`diversos\` varchar(255) NOT NULL, \`treinamentos\` varchar(255) NOT NULL, \`atribuicao\` varchar(255) NOT NULL, \`status\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`assigned_document\``);
    }

}
