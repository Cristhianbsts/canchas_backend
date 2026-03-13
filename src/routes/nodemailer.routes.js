import { Router } from "express";
import { sendEmail } from "../controllers/nodemailer.controller.js";
import { validateNodemailer } from "../middlewares/nodemailer.middleware.js";

const router = Router()

router.post("/", validateNodemailer, sendEmail )

export default router