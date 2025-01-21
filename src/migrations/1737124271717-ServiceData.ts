import { MigrationInterface, QueryRunner } from "typeorm";

export class ServiceData1737124271717 implements MigrationInterface {
    name = 'ServiceData1737124271717'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`service_data\` (\`id\` int NOT NULL AUTO_INCREMENT, \`cod\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`sell_value\` varchar(255) NULL, \`description\` varchar(255) NULL, \`duration\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`service_data\``);
    }

}
