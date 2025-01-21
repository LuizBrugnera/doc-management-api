import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOsService1737122663932 implements MigrationInterface {
  name = "AddOsService1737122663932";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`os\` (\`id\` int NOT NULL AUTO_INCREMENT, \`cod\` varchar(255) NOT NULL, \`status\` varchar(255) NOT NULL, \`client_name\` varchar(255) NOT NULL, \`client_id\` varchar(255) NOT NULL, \`seller_id\` varchar(255) NOT NULL, \`seller_name\` varchar(255) NOT NULL, \`technical_id\` varchar(255) NOT NULL, \`technical_name\` varchar(255) NOT NULL, \`entry_date\` datetime NOT NULL, \`exit_date\` datetime NOT NULL, \`situation_name\` varchar(255) NOT NULL, \`total_value\` varchar(255) NOT NULL, \`store_name\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`service\` (\`id\` int NOT NULL AUTO_INCREMENT, \`cod\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`quantity\` varchar(255) NOT NULL, \`total_value\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`os_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `ALTER TABLE \`service\` ADD CONSTRAINT \`FK_801f793f4728c050d643c074863\` FOREIGN KEY (\`os_id\`) REFERENCES \`os\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`service\` DROP FOREIGN KEY \`FK_801f793f4728c050d643c074863\``
    );
    await queryRunner.query(`DROP TABLE \`service\``);
    await queryRunner.query(`DROP TABLE \`os\``);
  }
}
