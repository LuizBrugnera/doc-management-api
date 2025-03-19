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
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

app.use("/api/v1", routes);

app.get("/docs", (req, res) => {
  res.sendFile(process.cwd() + "/swagger.html");
});

app.get("/doc.json", (req, res) => {
  res.sendFile(process.cwd() + "/doc.json");
});

app.use(errorMiddleware);

export default app;
