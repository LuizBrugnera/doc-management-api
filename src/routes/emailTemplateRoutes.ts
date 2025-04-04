import { Router } from "express";
import { EmailTemplateController } from "../controllers/EmailTemplateController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const emailTemplateController = new EmailTemplateController();

router.get(
  "/all",
  authMiddleware,
  emailTemplateController.getAllEmailTemplates
);
router.get(
  "/owner",
  authMiddleware,
  emailTemplateController.getEmailsTemplateByOwnerId
);

router.put(
  "/update/:id",
  authMiddleware,
  emailTemplateController.updateEmailTemplate
);
router.delete(
  "/delete/:id",
  authMiddleware,
  emailTemplateController.deleteEmailTemplate
);
router.post("/", authMiddleware, emailTemplateController.createEmailTemplate);

export default router;
