import Router from 'express';

import privateRouteHandler from "../middlewares/privateRouteHandler.js";
import {createProduct, getProductById, getProducts} from "../controllers/productsController.js";

const productRouter = Router();

productRouter.post("/create", privateRouteHandler, createProduct);
productRouter.get("/", getProducts);
productRouter.get("/:id", getProductById)

export default productRouter;