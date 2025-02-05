import { Router } from "express";
import { OsController } from "../controllers/OsController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const osController = new OsController();

router.get("/:id", authMiddleware, osController.getOsById);
router.get("/", osController.getAllOss);
router.put("/:id", osController.updateOs);
router.delete("/:id", authMiddleware, osController.deleteOs);
router.patch(
  "/update-services",
  authMiddleware,
  osController.updateOsWithServices
);

export default router;
