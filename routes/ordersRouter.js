import Router from 'express';

import privateRouteHandler from "../middlewares/privateRouteHandler.js";
import {
    createOrder
} from "../controllers/ordersController.js";

const orderRouter = Router();

orderRouter.post("/create", privateRouteHandler, createOrder);

export default orderRouter;