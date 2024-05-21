import Router from 'express';

import privateRouteHandler from "../middlewares/privateRouteHandler.js";
import {createProduct, getProducts} from "../controllers/productsController.js";

const productRouter = Router();

productRouter.post("/create", privateRouteHandler, createProduct);
productRouter.get("/", getProducts);

export default productRouter;