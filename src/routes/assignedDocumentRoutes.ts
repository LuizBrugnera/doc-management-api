import { Router } from "express";
import { AssignedDocumentController } from "../controllers/AssignedDocumentController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const assignedDocumentController = new AssignedDocumentController();

router.get("/", assignedDocumentController.getAllAssignedDocuments);
router.put(
  "/:id",
  authMiddleware,
  assignedDocumentController.updateAssignedDocument
);
router.delete(
  "/:id",
  authMiddleware,
  assignedDocumentController.deleteAssignedDocument
);
router.post("/", assignedDocumentController.createAssignedDocument);

export default router;
