import { MigrationInterface, QueryRunner } from "typeorm";

export class EmailTemplate1743776744532 implements MigrationInterface {
    name = 'EmailTemplate1743776744532'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`email_template\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`subject\` varchar(255) NOT NULL, \`content\` text NOT NULL, \`type\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`department_id\` int NULL, \`admin_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`email_template\` ADD CONSTRAINT \`FK_dd0cd5a1a25dea93f3d8fb544fd\` FOREIGN KEY (\`department_id\`) REFERENCES \`department\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`email_template\` ADD CONSTRAINT \`FK_55d64fc068b66f013e11b80ab1f\` FOREIGN KEY (\`admin_id\`) REFERENCES \`admin\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`email_template\` DROP FOREIGN KEY \`FK_55d64fc068b66f013e11b80ab1f\``);
        await queryRunner.query(`ALTER TABLE \`email_template\` DROP FOREIGN KEY \`FK_dd0cd5a1a25dea93f3d8fb544fd\``);
        await queryRunner.query(`DROP TABLE \`email_template\``);
    }

}
