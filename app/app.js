import express, {json} from 'express';

import connectDB from "../config/connectDB.js";
import userRouter from "../routes/usersRouter.js";
import errorHandler from "../middlewares/errorHandler.js";
import notFoundHandler from "../middlewares/notFoundHandler.js";

connectDB();
const app = express();

app.use(json());

app.use("/api/v1/users", userRouter);

app.use(errorHandler);
app.use(notFoundHandler);

export default app;