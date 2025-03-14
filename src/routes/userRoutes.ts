import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleAuthMiddleware } from "../middlewares/roleAuthMiddleware";

const router = Router();
const userController = new UserController();

router.get(
  "/",
  authMiddleware,
  (req, res, next) => {
    roleAuthMiddleware(req, res, next, ["admin", "department"]);
  },
  userController.getAllUsers
);
router.post("/name", authMiddleware, userController.getUserByNameInString);
router.get("/id/:id", authMiddleware, userController.getUserById);
router.get("/cod/:cod", authMiddleware, userController.getUserByCod);
router.post("/", authMiddleware, userController.createUser);
router.put("/:id", authMiddleware, userController.updateUser);
router.delete("/:id", authMiddleware, userController.deleteUser);

export default router;
