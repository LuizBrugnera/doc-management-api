import { Router } from "express";
import { QuestionaryController } from "../controllers/QuestionaryController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const questionaryController = new QuestionaryController();

router.get(
  "/one/:id",
  authMiddleware,
  questionaryController.getQuestionaryById
);
router.get("/", authMiddleware, questionaryController.getAllQuestionarys);
router.get(
  "/check-if-exists/:cpf",
  questionaryController.CheckIfExistsQuestionsWithCpf
);
router.get(
  "/check-if-hash-exists/:hash",
  questionaryController.CheckIfExistsQuestionsWithHash
);
//router.get("/all-of-cnpj/:cnpj", authMiddleware, questionaryController.getAllQuestionarysByCnpj);
router.put("/:id", authMiddleware, questionaryController.updateQuestionary);
router.delete("/:id", authMiddleware, questionaryController.deleteQuestionary);
router.post("/", questionaryController.createQuestionary);

export default router;
