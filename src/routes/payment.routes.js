import { Router } from "express";
import { authenticate } from "../middlewares/token.middleware.js";
import { createPayment, processApprovedCartPayment } from "../controllers/payment.controller.js";

const router = Router();

router.post("/", authenticate, createPayment, processApprovedCartPayment);

export default router;