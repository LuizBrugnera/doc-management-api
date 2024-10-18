import { Router } from "express";
import { NotificationController } from "../controllers/NotificationController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const notificationController = new NotificationController();

router.put(
  "/read/:id",
  authMiddleware,
  notificationController.updateNotificationRead
);
router.get(
  "/user",
  authMiddleware,
  notificationController.getNotificationByUserId
);

export default router;
