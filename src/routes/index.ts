import { Router } from "express";
import userRoutes from "./userRoutes";
import adminRoutes from "./adminRoutes";
import departmentRoutes from "./departmentRoutes";
import documentRoutes from "./documentRoutes";
import notificationRoutes from "./notificationRoutes";
import logRoutes from "./logRoutes";
import adminLogRoutes from "./adminLogRoutes";
import authRoutes from "./authRoutes";

const router = Router();

router.use("/users", userRoutes);
router.use("/admins", adminRoutes);
router.use("/departments", departmentRoutes);
router.use("/documents", documentRoutes);
router.use("/notifications", notificationRoutes);
router.use("/logs", logRoutes);
router.use("/admin-logs", adminLogRoutes);
router.use("/auth", authRoutes);

export default router;
