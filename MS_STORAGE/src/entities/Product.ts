import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("products")
export default class Product {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  name: string;

  @Column()
  price: string;

  @Column("integer")
  quantity: number;
}
