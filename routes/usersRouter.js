import Router from 'express';
import {loginUser, registerUser} from "../controllers/usersController.js";

const userRouter = Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

export default userRouter;