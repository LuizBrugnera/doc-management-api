import { Router } from "express";
import { AddressController } from "../controllers/AddressController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const logController = new AddressController();

router.get("/", authMiddleware, logController.getAllAddresses);
router.get("/:id", authMiddleware, logController.getAddressById);
router.post("/", authMiddleware, logController.createAddress);
router.post("/name", authMiddleware, logController.getByUserName);
router.put("/:id", authMiddleware, logController.updateAddress);
router.delete("/:id", authMiddleware, logController.deleteAddress);

export default router;
