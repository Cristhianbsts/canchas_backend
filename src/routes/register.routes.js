import { Router } from "express";
import { handleControllerRegister } from "../controllers/controllerRegister.js";
import { formRegisterValidation } from "../middlewares/register.middleware.js";


const router = Router();


router.post("/register",formRegisterValidation(),handleControllerRegister)

export default router;