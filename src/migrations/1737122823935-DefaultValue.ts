import { MigrationInterface, QueryRunner } from "typeorm";

export class DefaultValue1737122823935 implements MigrationInterface {
  name = "DefaultValue1737122823935";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`os\` CHANGE \`status\` \`status\` varchar(255) NOT NULL DEFAULT 'pending'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`os\` CHANGE \`status\` \`status\` varchar(255) NOT NULL`
    );
  }
}
