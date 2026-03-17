import { Router } from "express";
import { validateLoginUser } from "../middlewares/login.middleware.js";
import { login, getProfile } from "../controllers/login.controller.js";
import { authenticate } from "../middlewares/token.middleware.js";

const router = Router();



router.post("/", validateLoginUser(), login);
router.get("/profile", authenticate, getProfile);


export default router;
