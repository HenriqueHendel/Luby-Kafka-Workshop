import { Router } from "express";
import ProductsController from "../controllers/ProductsController";

const controller = new ProductsController();

const router = Router();

router.get("/products", controller.index);
router.post("/products", controller.create);
router.post("/purchase/:id", controller.purchase);

export default router;
