import { Router } from "express";
import { validateLoginUser } from "../middlewares/validator.middleware.js";
import { login } from "../controllers/auth.controller.js";

const router = Router();



router.post("/login",validateLoginUser(),login)


export default router;
