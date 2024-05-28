import Router from 'express';
import {getUserProfile, loginUser, registerUser, updateUserProfile} from "../controllers/usersController.js";
import privateRouteHandler from "../middlewares/privateRouteHandler.js";

const userRouter = Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/profile", privateRouteHandler, getUserProfile);
userRouter.put("/profile", privateRouteHandler, updateUserProfile);

export default userRouter;