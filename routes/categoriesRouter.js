import Router from 'express';

import privateRouteHandler from "../middlewares/privateRouteHandler.js";
import {
    createProduct,
    deleteProductById,
    getProductById,
    getProducts,
    updateProductById
} from "../controllers/productsController.js";
import {
    createCategory, deleteCategoryById,
    getCategories,
    getCategoryById,
    updateCategoryById
} from "../controllers/categoriesController.js";

const categoryRouter = Router();

categoryRouter.post("/create", privateRouteHandler, createCategory);
categoryRouter.get("/", getCategories);
categoryRouter.get("/:id", getCategoryById);
categoryRouter.put("/:id", privateRouteHandler, updateCategoryById);
categoryRouter.delete("/:id", privateRouteHandler, deleteCategoryById);

export default categoryRouter;