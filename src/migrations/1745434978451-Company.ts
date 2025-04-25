import { MigrationInterface, QueryRunner } from "typeorm";

export class Company1745434978451 implements MigrationInterface {
    name = 'Company1745434978451'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`company\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`cnpj\` varchar(255) NOT NULL, \`quantity_colaboradores\` int NOT NULL, \`hash\` varchar(255) NOT NULL, \`result\` json NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`company\``);
    }

}
