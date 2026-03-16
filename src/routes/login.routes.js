import { Router } from "express";
import { validateLoginUser } from "../middlewares/login.middleware.js";
import { login } from "../controllers/login.controller.js";

const router = Router();



router.post("/",validateLoginUser(),login)


export default router;
