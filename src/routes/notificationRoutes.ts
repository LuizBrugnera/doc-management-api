import { Router } from "express";
import { NotificationController } from "../controllers/NotificationController";

const router = Router();
const notificationController = new NotificationController();

router.get("/", notificationController.getAllNotifications);
router.get("/:id", notificationController.getNotificationById);
router.post("/", notificationController.createNotification);
router.put("/:id", notificationController.updateNotification);
router.delete("/:id", notificationController.deleteNotification);

export default router;
