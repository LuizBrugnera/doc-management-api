import { Router } from "express";
import { DocumentController } from "../controllers/DocumentController";

const router = Router();
const documentController = new DocumentController();

router.get("/", documentController.getAllDocuments);
router.get("/:id", documentController.getDocumentById);
router.post("/", documentController.createDocument);
router.put("/:id", documentController.updateDocument);
router.delete("/:id", documentController.deleteDocument);

export default router;
