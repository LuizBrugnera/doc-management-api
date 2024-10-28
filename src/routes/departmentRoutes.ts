import { Router } from "express";
import { DepartmentController } from "../controllers/DepartmentController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleAuthMiddleware } from "../middlewares/roleAuthMiddleware";

const router = Router();
const departmentController = new DepartmentController();

router.get(
  "/",
  authMiddleware,
  (req, res, next) => {
    roleAuthMiddleware(req, res, next, ["admin"]);
  },
  departmentController.getAllDepartments
);
router.get("/:id", authMiddleware, departmentController.getDepartmentById);
router.post("/", authMiddleware, departmentController.createDepartment);
router.put("/:id", authMiddleware, departmentController.updateDepartment);
router.delete(
  "/:id",
  authMiddleware,
  (req, res, next) => {
    roleAuthMiddleware(req, res, next, ["admin"]);
  },
  departmentController.deleteDepartment
);
router.get(
  "/by-department/:department",
  departmentController.getDepartmentsByDepartment
);
export default router;
