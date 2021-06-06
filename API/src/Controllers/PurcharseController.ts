import { Request, Response } from "express";
import Producer from "../KafkaService/Producer";

class PurchaseController {
  public async purchase(
    request: Request,
    response: Response
  ): Promise<Response> {
    try {
      const { id, quantity, purchaseId } = request.body;

      console.log(purchaseId);

      const data = JSON.stringify({ id, quantity, purchaseId });

      const producer = new Producer();
      producer.produce({ topic: "new-purchase", messages: [{ value: data }] });
      producer.produce({
        topic: "product-bought",
        messages: [{ value: JSON.stringify({ productId: id, purchaseId }) }],
      });

      return response.json(data);
    } catch (error) {
      console.log(error);
      return response.status(400).json(error);
    }
  }
}

export default PurchaseController;
