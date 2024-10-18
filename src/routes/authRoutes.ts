import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleAuthMiddleware } from "../middlewares/roleAuthMiddleware";

const router = Router();
const authController = new AuthController();

router.post("/user/register", authController.registerUser);
router.post("/user/login", authController.loginUser);
router.post(
  "/admin/register",
  authMiddleware,
  (req, res, next) => {
    roleAuthMiddleware(req, res, next, ["admin"]);
  },
  authController.registerAdmin
);
router.post("/admin/login", authController.loginAdmin);
router.post(
  "/department/register",
  authMiddleware,
  (req, res, next) => {
    roleAuthMiddleware(req, res, next, ["admin"]);
  },
  authController.registerDepartment
);
router.post("/department/login", authController.loginDepartment);
router.post("/generate-code", authController.generateCode);
router.post("/verify-code", authController.verifyCode);
router.post("/reset-password", authController.resetPassword);
router.post(
  "/change-password",
  authMiddleware,
  authController.updatePasswordWithPassword
);
router.get("/user-info", authMiddleware, authController.getUserInfo);

export default router;
