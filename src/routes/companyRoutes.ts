import { Router } from "express";
import { CompanyController } from "../controllers/CompanyController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const companyController = new CompanyController();

router.get("/one/:id", authMiddleware, companyController.getCompanyById);
router.get("/", authMiddleware, companyController.getAllCompanys);
router.get(
  "/check-if-hash-exists/:hash",
  companyController.CheckIfExistsQuestionsWithHash
);
router.post(
  "/check-if-cnpj-exists",
  companyController.checkIfExistsQuestionsWithCnpj
);
router.get("/hash/:hash", companyController.getCompanyByHash);
router.put("/:id", authMiddleware, companyController.updateCompany);
router.delete("/:id", authMiddleware, companyController.deleteCompany);
router.post("/", companyController.createCompany);

export default router;
