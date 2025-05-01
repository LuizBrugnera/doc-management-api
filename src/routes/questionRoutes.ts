import { Router } from "express";
import { QuestionController } from "../controllers/QuestionController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const questionController = new QuestionController();

router.get("/", questionController.getAllQuestions);

router.put("/:id", authMiddleware, questionController.updateQuestion);
router.delete("/:id", authMiddleware, questionController.deleteQuestion);
router.post("/", questionController.createQuestion);

export default router;
