import { Router } from "express"; 
import { activeUser, getUser, suspendUser } from "../controller/user.controller.js";



const router = Router();

router.get("/", getUser);

router.patch("/:id/activate", activeUser);

router.patch("/:id/suspend", suspendUser);




export default router;
