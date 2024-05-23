import Router from 'express';

import privateRouteHandler from "../middlewares/privateRouteHandler.js";
import {
    createProduct,
    deleteProductById,
    getProductById,
    getProducts,
    updateProductById
} from "../controllers/productsController.js";

const productRouter = Router();

productRouter.post("/create", privateRouteHandler, createProduct);
productRouter.get("/", getProducts);
productRouter.get("/:id", getProductById)
productRouter.put("/:id", privateRouteHandler, updateProductById)
productRouter.delete("/:id", privateRouteHandler, deleteProductById)

export default productRouter;