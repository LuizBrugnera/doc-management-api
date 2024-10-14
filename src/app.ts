import express from "express";
import "reflect-metadata";
import routes from "./routes/index";
import { json, urlencoded } from "express";
import cors from "cors";
import { errorMiddleware } from "./middlewares/errorMiddleware";

const app = express();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

app.use("/api/v1", routes);

app.use(errorMiddleware);

export default app;
