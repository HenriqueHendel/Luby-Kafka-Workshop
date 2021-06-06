import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class ProductTable1620525945768 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "products",
        columns: [
          {
            name: "id",
            type: "integer",
            isPrimary: true,
            generationStrategy: "increment",
            isGenerated: true,
          },
          {
            name: "name",
            type: "varchar",
          },
          {
            name: "price",
            type: "varchar",
          },
          {
            name: "quantity",
            type: "integer",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("products");
  }
}
