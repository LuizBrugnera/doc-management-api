import { Router } from "express";
import { AdminLogController } from "../controllers/AdminLogController";
import { roleAuthMiddleware } from "../middlewares/roleAuthMiddleware";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const adminLogController = new AdminLogController();

router.get(
  "/",
  authMiddleware,
  (req, res, next) => {
    roleAuthMiddleware(req, res, next, ["admin"]);
  },
  adminLogController.getAllAdminLogs
);
router.get(
  "/:id",
  authMiddleware,
  (req, res, next) => {
    roleAuthMiddleware(req, res, next, ["admin"]);
  },
  adminLogController.getAdminLogById
);
router.post(
  "/",
  authMiddleware,
  (req, res, next) => {
    roleAuthMiddleware(req, res, next, ["admin"]);
  },
  adminLogController.createAdminLog
);
router.put(
  "/:id",
  authMiddleware,
  (req, res, next) => {
    roleAuthMiddleware(req, res, next, ["admin"]);
  },
  adminLogController.updateAdminLog
);

export default router;
