import { Router } from "express";
import userRoutes from "./userRoutes";
import adminRoutes from "./adminRoutes";
import departmentRoutes from "./departmentRoutes";
import documentRoutes from "./documentRoutes";
import notificationRoutes from "./notificationRoutes";
import logRoutes from "./logRoutes";
import adminLogRoutes from "./adminLogRoutes";
import authRoutes from "./authRoutes";
import osRoutes from "./osRoutes";
import serviceRoutes from "./serviceRoutes";
import serviceDataRoutes from "./serviceDataRoutes";
import osHistoricRoutes from "./osHistoricRoutes";
import emailTemplateRoutes from "./emailTemplateRoutes";

const router = Router();

router.use("/users", userRoutes);
router.use("/admins", adminRoutes);
router.use("/departments", departmentRoutes);
router.use("/documents", documentRoutes);
router.use("/notifications", notificationRoutes);
router.use("/logs", logRoutes);
router.use("/admin-logs", adminLogRoutes);
router.use("/auth", authRoutes);
router.use("/os", osRoutes);
router.use("/services", serviceRoutes);
router.use("/service-datas", serviceDataRoutes);
router.use("/os-historics", osHistoricRoutes);
router.use("/email-templates", emailTemplateRoutes);

export default router;
