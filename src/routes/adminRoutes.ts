import { Router } from "express";
import { AdminController } from "../controllers/AdminController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleAuthMiddleware } from "../middlewares/roleAuthMiddleware";

const router = Router();
const adminController = new AdminController();

router.put(
  "/:id",
  authMiddleware,
  (req, res, next) => {
    roleAuthMiddleware(req, res, next, ["admin"]);
  },
  adminController.updateAdmin
);

export default router;
