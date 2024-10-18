import { Router } from "express";
import { DocumentController } from "../controllers/DocumentController";
import { upload } from "../middlewares/documentMiddleware";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleAuthMiddleware } from "../middlewares/roleAuthMiddleware";
import { autoAssignUpload } from "../middlewares/autoAssignMiddleware";

const router = Router();
const documentController = new DocumentController();

router.post(
  "/upload/file/:userId",
  authMiddleware,
  (req, res, next) => {
    roleAuthMiddleware(req, res, next, ["admin", "department"]);
  },
  upload.single("document"),
  documentController.uploadDocument
);
router.post(
  "/upload/auto-assign",
  authMiddleware,
  (req, res, next) => {
    roleAuthMiddleware(req, res, next, ["admin", "department"]);
  },
  autoAssignUpload.single("document"),
  documentController.autoAssignUploadDocument
);
router.get(
  "/download/:documentId/:userId?",
  authMiddleware,
  documentController.downloadDocument
);
router.get("/user", authMiddleware, documentController.getDocumentsByUser);
router.get(
  "/department",
  authMiddleware,
  (req, res, next) => {
    roleAuthMiddleware(req, res, next, ["department"]);
  },
  documentController.getDocumentsByDepartmentFolderAccess
);

router.get(
  "/folder-format",
  authMiddleware,
  documentController.getDocumentsByUserIdInFolderFormat
);

router.get(
  "/",
  authMiddleware,
  (req, res, next) => {
    roleAuthMiddleware(req, res, next, ["admin"]);
  },
  documentController.getAllDocuments
);

router.delete(
  "/:documentId",
  authMiddleware,
  documentController.deleteDocument
);
export default router;
