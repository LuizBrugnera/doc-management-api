import { MigrationInterface, QueryRunner } from "typeorm";

export class NullableValues1737122967903 implements MigrationInterface {
  name = "NullableValues1737122967903";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`os\` CHANGE \`client_name\` \`client_name\` varchar(255) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`os\` CHANGE \`client_id\` \`client_id\` varchar(255) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`os\` CHANGE \`seller_id\` \`seller_id\` varchar(255) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`os\` CHANGE \`seller_name\` \`seller_name\` varchar(255) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`os\` CHANGE \`technical_id\` \`technical_id\` varchar(255) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`os\` CHANGE \`technical_name\` \`technical_name\` varchar(255) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`os\` CHANGE \`entry_date\` \`entry_date\` datetime NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`os\` CHANGE \`exit_date\` \`exit_date\` datetime NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`os\` CHANGE \`situation_name\` \`situation_name\` varchar(255) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`os\` CHANGE \`total_value\` \`total_value\` varchar(255) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`os\` CHANGE \`store_name\` \`store_name\` varchar(255) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`service\` CHANGE \`quantity\` \`quantity\` varchar(255) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`service\` CHANGE \`total_value\` \`total_value\` varchar(255) NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`service\` CHANGE \`total_value\` \`total_value\` varchar(255) NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`service\` CHANGE \`quantity\` \`quantity\` varchar(255) NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`os\` CHANGE \`store_name\` \`store_name\` varchar(255) NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`os\` CHANGE \`total_value\` \`total_value\` varchar(255) NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`os\` CHANGE \`situation_name\` \`situation_name\` varchar(255) NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`os\` CHANGE \`exit_date\` \`exit_date\` datetime NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`os\` CHANGE \`entry_date\` \`entry_date\` datetime NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`os\` CHANGE \`technical_name\` \`technical_name\` varchar(255) NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`os\` CHANGE \`technical_id\` \`technical_id\` varchar(255) NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`os\` CHANGE \`seller_name\` \`seller_name\` varchar(255) NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`os\` CHANGE \`seller_id\` \`seller_id\` varchar(255) NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`os\` CHANGE \`client_id\` \`client_id\` varchar(255) NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`os\` CHANGE \`client_name\` \`client_name\` varchar(255) NOT NULL`
    );
  }
}
