import { Router } from "express";
import { AuthController } from "../controllers/AuthController";

const router = Router();
const authController = new AuthController();

router.post("/user/register", authController.registerUser);
router.post("/user/login", authController.loginUser);
router.post("/admin/register", authController.registerAdmin);
router.post("/admin/login", authController.loginAdmin);
router.post("/department/register", authController.registerDepartment);
router.post("/department/login", authController.loginDepartment);

export default router;
