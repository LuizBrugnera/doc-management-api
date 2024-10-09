import { Router } from "express";
import { AdminController } from "../controllers/AdminController";

const router = Router();
const adminController = new AdminController();

router.get("/", adminController.getAllAdmins);
router.get("/:id", adminController.getAdminById);
router.post("/", adminController.createAdmin);
router.put("/:id", adminController.updateAdmin);
router.delete("/:id", adminController.deleteAdmin);

export default router;
