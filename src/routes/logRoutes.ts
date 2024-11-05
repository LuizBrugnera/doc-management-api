import { Router } from "express";
import { LogController } from "../controllers/LogController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleAuthMiddleware } from "../middlewares/roleAuthMiddleware";

const router = Router();
const logController = new LogController();

router.get(
  "/",
  authMiddleware,
  (req, res, next) => {
    roleAuthMiddleware(req, res, next, ["admin", "department"]);
  },
  logController.getAllLogs
);
router.get(
  "/:id",
  authMiddleware,
  (req, res, next) => {
    roleAuthMiddleware(req, res, next, ["admin", "department"]);
  },
  logController.getLogById
);
router.post(
  "/",
  authMiddleware,
  (req, res, next) => {
    roleAuthMiddleware(req, res, next, ["admin", "department"]);
  },
  logController.createLog
);
router.put(
  "/:id",
  authMiddleware,
  (req, res, next) => {
    roleAuthMiddleware(req, res, next, ["admin", "department"]);
  },
  logController.updateLog
);
router.delete(
  "/:id",
  authMiddleware,
  (req, res, next) => {
    roleAuthMiddleware(req, res, next, ["admin", "department"]);
  },
  logController.deleteLog
);

export default router;
