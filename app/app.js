import express, {json} from 'express';

import connectDB from "../config/connectDB.js";
import userRouter from "../routes/usersRouter.js";
import errorHandler from "../middlewares/errorHandler.js";
import notFoundHandler from "../middlewares/notFoundHandler.js";
import productRouter from "../routes/productRouter.js";
import categoryRouter from "../routes/categoriesRouter.js";

connectDB();
const app = express();

app.use(json());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/categories", categoryRouter)

app.use(errorHandler);
app.use(notFoundHandler);

export default app;