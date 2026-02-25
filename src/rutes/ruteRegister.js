import { Router } from "express";
import { handleControllerRegister } from "../controllers/controllerRegister.js";
import { formRegisterValidation } from "../middleware/validationRegister.js";


const router = Router();


router.post("/register",formRegisterValidation(),handleControllerRegister)

export default router;