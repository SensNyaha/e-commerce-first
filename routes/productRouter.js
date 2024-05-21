import Router from 'express';

import privateRouteHandler from "../middlewares/privateRouteHandler.js";
import {createProduct} from "../controllers/productsController.js";

const productRouter = Router();

productRouter.post("/create", privateRouteHandler, createProduct);

export default productRouter;