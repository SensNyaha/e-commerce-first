import express, {json} from 'express';

import connectDB from "../config/connectDB.js";
import userRouter from "../routes/usersRouter.js";
import errorHandler from "../middlewares/errorHandler.js";
import notFoundHandler from "../middlewares/notFoundHandler.js";
import productRouter from "../routes/productRouter.js";
import categoryRouter from "../routes/categoriesRouter.js";
import brandRouter from "../routes/brandsRouter.js";
import colorRouter from "../routes/colorsRouter.js";
import reviewRouter from "../routes/reviewRouter.js";
import ordersRouter from "../routes/ordersRouter.js";
import Stripe from "stripe";
import webHookRouter from "../routes/webHookRouter.js";

connectDB();
const app = express();

app.use(webHookRouter);

app.use(json());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/categories", categoryRouter)
app.use("/api/v1/brands", brandRouter)
app.use("/api/v1/colors", colorRouter)
app.use("/api/v1/reviews", reviewRouter)
app.use("/api/v1/orders", ordersRouter)





app.use(errorHandler);
app.use(notFoundHandler);

export default app;