import express from "express";
import {
  like,
  login,
  order,
  rateRes,
  signUp,
} from "../controllers/userController.js";
import { verifyToken } from "../config/jwt.js";
import { wrapRequestHandle } from "../utils/handlers.js";

const userRoute = express.Router();

userRoute.post("/sign-up", wrapRequestHandle(signUp));
userRoute.post("/login", wrapRequestHandle(login));
userRoute.post("/like", verifyToken, wrapRequestHandle(like));
userRoute.post("/rate-res", verifyToken, wrapRequestHandle(rateRes));
userRoute.post("/order", verifyToken, order);

export default userRoute;
