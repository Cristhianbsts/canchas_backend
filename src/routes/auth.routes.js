import { Router } from "express";
import { validateLoginUser } from "../middlewares/auth.middleware.js";
import { login } from "../controller/auth.controller.js";

const router = Router();



router.post("/login",validateLoginUser(),login)


export default router;
