import Router from 'express';

import privateRouteHandler from "../middlewares/privateRouteHandler.js";
import {
    createProduct,
    deleteProductById,
    getProductById,
    getProducts,
    updateProductById
} from "../controllers/productsController.js";
import {createCategory} from "../controllers/categoriesController.js";

const categoryRouter = Router();

categoryRouter.post("/create", privateRouteHandler, createCategory);

export default categoryRouter;