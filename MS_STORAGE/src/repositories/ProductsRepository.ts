import { Repository, getRepository } from "typeorm";
import Product from "../entities/Product";

interface IProduct {
  name: string;
  price: string;
  quantity: number;
}

interface IPurchase {
  id: number;
  quantity: number;
}

export default class ProductsRepository {
  private productsRepository: Repository<Product>;

  constructor() {
    this.productsRepository = getRepository(Product);
  }

  public async findById(id: number): Promise<Product | undefined> {
    const product = await this.productsRepository.findOne(id);

    return product;
  }

  public async create({ name, price, quantity }: IProduct): Promise<Product> {
    const product = this.productsRepository.create({ name, price, quantity });
    await this.productsRepository.save(product);

    return product;
  }

  public async purchase({
    id,
    quantity,
  }: IPurchase): Promise<Product | undefined> {
    const product = await this.productsRepository.findOne({ where: { id } });

    if (product) {
      product.quantity -= quantity;
      await this.productsRepository.save(product);
    }

    return product;
  }
}
