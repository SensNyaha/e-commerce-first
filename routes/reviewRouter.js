import Router from 'express';

import privateRouteHandler from "../middlewares/privateRouteHandler.js";
import {createReview, deleteReview} from "../controllers/reviewController.js";



const reviewRouter = Router();

reviewRouter.post("/:productID", privateRouteHandler, createReview);
reviewRouter.delete("/:reviewID", privateRouteHandler, deleteReview);


export default reviewRouter;