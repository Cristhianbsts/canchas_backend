import { Router } from "express";
import { handleControllerRegister } from "../controllers/register.controller.js";
import { formRegisterValidation } from "../middlewares/register.middleware.js";


const router = Router();


router.post("/",formRegisterValidation(),handleControllerRegister)

export default router;