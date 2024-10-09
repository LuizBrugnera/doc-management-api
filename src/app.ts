import express from "express";
import "reflect-metadata";
import routes from "./routes/index";
import { json, urlencoded } from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

app.use("/api", routes);

// app.use(errorMiddleware);

export default app;
