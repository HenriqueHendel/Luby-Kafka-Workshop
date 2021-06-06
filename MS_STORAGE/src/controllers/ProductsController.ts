import { Request, Response } from "express";
import Product from "../entities/Product";
import { getRepository } from "typeorm";
import CreateProductsService from "../services/CreateProductsService";
import PurchaseProductsService from "../services/PurchaseProductService";

export default class ProductController {
  public async index(request: Request, response: Response): Promise<Response> {
    const products = await getRepository(Product).find({
      order: { id: "ASC" },
    });

    return response.json(products);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, price, quantity } = request.body;
    const service = new CreateProductsService();

    const product = await service.execute({ name, price, quantity });

    return response.json(product);
  }

  public async purchase(
    request: Request,
    response: Response
  ): Promise<Response> {
    try {
      const { id } = request.params;
      const { quantity } = request.body;
      const service = new PurchaseProductsService();

      const numberId = Number(id);

      const product = await service.execute({ id: numberId, quantity });

      return response.json(product);
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }
}
