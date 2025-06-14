import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreatedAtToUser1749875962446 implements MigrationInterface {
    name = 'AddCreatedAtToUser1749875962446'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`brand\` DROP COLUMN \`description\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`brand\` ADD \`description\` varchar(255) NOT NULL DEFAULT ''`);
    }

}
