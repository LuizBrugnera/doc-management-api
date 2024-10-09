import { Router } from "express";
import { LogController } from "../controllers/LogController";

const router = Router();
const logController = new LogController();

router.get("/", logController.getAllLogs);
router.get("/:id", logController.getLogById);
router.post("/", logController.createLog);
router.put("/:id", logController.updateLog);
router.delete("/:id", logController.deleteLog);

export default router;
