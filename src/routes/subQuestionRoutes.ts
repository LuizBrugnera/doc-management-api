import { Router } from "express";
import { SubQuestionController } from "../controllers/SubQuestionController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const subQuestionController = new SubQuestionController();

router.get("/", subQuestionController.getAllSubQuestions);

router.put("/:id", authMiddleware, subQuestionController.updateSubQuestion);
router.delete("/:id", authMiddleware, subQuestionController.deleteSubQuestion);
router.post("/", subQuestionController.createSubQuestion);

export default router;
