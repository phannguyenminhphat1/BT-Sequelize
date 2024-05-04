import express from "express";
import userRoute from "./userRoute.js";
import resRoute from "./resRoute.js";
const rootRoute = express.Router();

rootRoute.use("/user", userRoute);
rootRoute.use("/res", resRoute);

export default rootRoute;
