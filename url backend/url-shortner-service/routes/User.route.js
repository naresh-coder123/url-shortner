import { Router } from "express";
import {
  registerUser,
  loginUser,
  loggout,
} from "../controllers/User.controller.js";
import { verifyJwt } from "../middlewares/Auth.middleware.js";

const UserRouter = Router();

UserRouter.route("/register").post(registerUser);
UserRouter.route("/login").post(loginUser);
UserRouter.route("/logout").post(verifyJwt, loggout);

export default UserRouter;
