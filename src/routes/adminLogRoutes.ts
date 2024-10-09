import { Router } from "express";
import { AdminLogController } from "../controllers/AdminLogController";

const router = Router();
const adminLogController = new AdminLogController();

router.get("/", adminLogController.getAllAdminLogs);
router.get("/:id", adminLogController.getAdminLogById);
router.post("/", adminLogController.createAdminLog);
router.put("/:id", adminLogController.updateAdminLog);
router.delete("/:id", adminLogController.deleteAdminLog);

export default router;
