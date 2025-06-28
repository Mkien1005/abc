import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCreatedAtToUser1749904131300 implements MigrationInterface {
  name = 'AddCreatedAtToUser1749904131300';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`inventory_imports\` DROP COLUMN \`brandName\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`inventory_imports\` ADD \`brandName\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`brand\` ADD \`description\` varchar(255) NULL DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`brand\` CHANGE \`description\` \`description\` varchar(255) NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE \`inventory_imports\` DROP COLUMN \`brandName\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`inventory_imports\` ADD \`brandName\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`inventory_imports\` CHANGE \`brandName\` \`supplier\` varchar(255) NULL`,
    );
  }
}
