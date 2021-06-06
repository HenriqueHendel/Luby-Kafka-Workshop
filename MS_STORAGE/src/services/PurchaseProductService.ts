import ProductsRepository from "../repositories/ProductsRepository";
import Product from "../entities/Product";

interface IRequest {
  id: number;
  quantity: number;
}

export default class PurchaseProductService {
  public async execute({
    id,
    quantity,
  }: IRequest): Promise<Product | undefined> {
    const repository = new ProductsRepository();

    const product = await repository.findById(id);

    if (!product) {
      throw new Error("This product doesn't exists! ");
    }

    if (product.quantity == 0) {
      throw new Error("This product is over!");
    }

    if (product.quantity < quantity) {
      throw new Error(
        `We only have ${product.quantity} quantities of this product!`
      );
    }

    const purchasedProduct = await repository.purchase({ id, quantity });

    return purchasedProduct;
  }
}
