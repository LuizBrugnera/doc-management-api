import { Router } from "express";
import { DepartmentController } from "../controllers/DepartmentController";

const router = Router();
const departmentController = new DepartmentController();

router.get("/", departmentController.getAllDepartments);
router.get("/:id", departmentController.getDepartmentById);
router.post("/", departmentController.createDepartment);
router.put("/:id", departmentController.updateDepartment);
router.delete("/:id", departmentController.deleteDepartment);
router.get(
  "/by-department/:department",
  departmentController.getDepartmentsByDepartment
);
export default router;
