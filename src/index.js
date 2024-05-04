import express from "express";
import rootRoute from "./routes/rootRoute.js";

const app = express();
const port = 8080;

app.use(express.json());
app.use("/api", rootRoute);
app.listen(port);
