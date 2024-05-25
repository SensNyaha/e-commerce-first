import Router from 'express';

import privateRouteHandler from "../middlewares/privateRouteHandler.js";
import {
    createColor,
    deleteColorById,
    getColorById,
    getColors,
    updateColorById
} from "../controllers/colorsController.js";



const colorRouter = Router();

colorRouter.post("/create", privateRouteHandler, createColor);
colorRouter.get("/", getColors);
colorRouter.get("/:id", getColorById);
colorRouter.put("/:id", privateRouteHandler, updateColorById);
colorRouter.delete("/:id", privateRouteHandler, deleteColorById);

export default colorRouter;