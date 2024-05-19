import express, {json} from 'express';

import connectDB from "../config/connectDB.js";
import userRouter from "../routes/usersRouter.js";

connectDB();
const app = express();

app.use(json());

app.use("/api/v1/users", userRouter);

export default app;