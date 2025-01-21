import { Router } from "express";
import { ServiceDataController } from "../controllers/ServiceDataController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const serviceDataController = new ServiceDataController();

router.get("/:id", authMiddleware, serviceDataController.getServiceDataById);
router.get("/", authMiddleware, serviceDataController.getAllServiceDatas);
router.put("/:id", authMiddleware, serviceDataController.updateServiceData);
router.delete("/:id", authMiddleware, serviceDataController.deleteServiceData);

export default router;
