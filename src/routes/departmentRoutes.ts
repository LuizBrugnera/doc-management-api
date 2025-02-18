
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
router.get(
  "/:id",
  authMiddleware,
  (req, res, next) => {
    roleAuthMiddleware(req, res, next, ["admin", "department"]);
  },
  departmentController.getDepartmentById
);
router.post(
  "/",
  authMiddleware,
  authMiddleware,
  (req, res, next) => {
    roleAuthMiddleware(req, res, next, ["admin"]);
  },
  departmentController.createDepartment
);
router.put(
  "/:id",
  authMiddleware,
  (req, res, next) => {
    roleAuthMiddleware(req, res, next, ["admin", "department"]);
  },
  departmentController.updateDepartment
);
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
  (req, res, next) => {
    roleAuthMiddleware(req, res, next, ["admin", "department"]);
  },
  departmentController.getDepartmentsByDepartment
);
export default router;
