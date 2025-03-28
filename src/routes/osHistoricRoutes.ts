import { Router } from "express";
import { OsHistoricController } from "../controllers/OsHistoricController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const osHistoricController = new OsHistoricController();

router.get("/all", authMiddleware, osHistoricController.getAllOsHistoric);
router.get(
  "/all/:id",
  authMiddleware,
  osHistoricController.getAllOsHistoricByOsId
);
router.post("/", osHistoricController.createOsHistoric);

export default router;
