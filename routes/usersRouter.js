import Router from 'express';
import {getUserProfile, loginUser, registerUser} from "../controllers/usersController.js";
import privateRouteHandler from "../middlewares/privateRouteHandler.js";

const userRouter = Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/profile", privateRouteHandler, getUserProfile);

export default userRouter;