import { Router } from "express";
import { OsController } from "../controllers/OsController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const osController = new OsController();

router.get("/id/:id", authMiddleware, osController.getOsById);
router.get("/name/:name", authMiddleware, osController.getOsByName);
router.get("/", authMiddleware, osController.getAllOss);
router.put("/:id", osController.updateOs);
router.delete("/:id", authMiddleware, osController.deleteOs);
router.patch(
  "/update-services",
  authMiddleware,
  osController.updateOsWithServices
);
router.patch("/update-api", authMiddleware, osController.updateOsDbWithGestao);

export default router;
