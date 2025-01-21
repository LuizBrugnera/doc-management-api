import { Router } from "express";
import { ServiceController } from "../controllers/ServiceController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const serviceController = new ServiceController();

router.get("/:id", authMiddleware, serviceController.getServiceById);
router.get("/", authMiddleware, serviceController.getAllServices);
router.put("/:id", authMiddleware, serviceController.updateService);
router.delete("/:id", authMiddleware, serviceController.deleteService);

export default router;
