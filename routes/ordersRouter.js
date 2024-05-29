import Router from 'express';

import privateRouteHandler from "../middlewares/privateRouteHandler.js";
import {
    createOrder, getAllOrders
} from "../controllers/ordersController.js";
import adminRouteHandler from "../middlewares/adminRouteHandler.js";

const orderRouter = Router();

orderRouter.post("/create", privateRouteHandler, createOrder);
orderRouter.get("/", adminRouteHandler, getAllOrders);

export default orderRouter;