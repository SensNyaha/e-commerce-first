import Router from 'express';

import privateRouteHandler from "../middlewares/privateRouteHandler.js";
import {
    createBrand,
    deleteBrandById,
    getBrandById,
    getBrands,
    updateBrandById
} from "../controllers/brandsController.js";


const brandRouter = Router();

brandRouter.post("/create", privateRouteHandler, createBrand);
brandRouter.get("/", getBrands);
brandRouter.get("/:id", getBrandById);
brandRouter.put("/:id", privateRouteHandler, updateBrandById);
brandRouter.delete("/:id", privateRouteHandler, deleteBrandById);

export default brandRouter;