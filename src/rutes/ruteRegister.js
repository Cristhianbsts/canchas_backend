import { Router } from "express";
import { handleControllerRegister } from "../controllers/controllerRegister.js";


const router = Router();


router.post("/register",handleControllerRegister)

export default router;