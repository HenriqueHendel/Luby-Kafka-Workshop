import ProductsRepository from "../repositories/ProductsRepository";
import Product from "../entities/Product";

interface IRequest {
  name: string;
  price: string;
  quantity: number;
}

export default class ProductsService {
  public async execute(data: IRequest): Promise<Product> {
    const productRepository = new ProductsRepository();

    const product = await productRepository.create({ ...data });

    return product;
  }
}
