import express from "express";
import { wrapRequestHandle } from "../utils/handlers.js";
import { getLike, getRate } from "../controllers/restaurantController.js";

const resRoute = express.Router();

resRoute.get("/get-like", wrapRequestHandle(getLike));
resRoute.get("/get-rate", wrapRequestHandle(getRate));

export default resRoute;
