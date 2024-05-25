import Router from 'express';

import privateRouteHandler from "../middlewares/privateRouteHandler.js";
import {createReview} from "../controllers/reviewController.js";



const reviewRouter = Router();

reviewRouter.post("/:productID", privateRouteHandler, createReview);
// reviewRouter.get("/", getBrands);
// reviewRouter.get("/:id", getBrandById);
// reviewRouter.put("/:id", privateRouteHandler, updateBrandById);
// reviewRouter.delete("/:id", privateRouteHandler, deleteBrandById);

export default reviewRouter;