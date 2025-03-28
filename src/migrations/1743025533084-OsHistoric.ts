import { MigrationInterface, QueryRunner } from "typeorm";

export class OsHistoric1743025533084 implements MigrationInterface {
    name = 'OsHistoric1743025533084'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`os_historic\` (\`id\` int NOT NULL AUTO_INCREMENT, \`status\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`last_update\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`os_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`os_historic\` ADD CONSTRAINT \`FK_286f0f63f4eabdd494ecf7a05da\` FOREIGN KEY (\`os_id\`) REFERENCES \`os\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`os_historic\` DROP FOREIGN KEY \`FK_286f0f63f4eabdd494ecf7a05da\``);
        await queryRunner.query(`DROP TABLE \`os_historic\``);
    }

}
