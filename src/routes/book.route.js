import { getBookTimes, reserveCourt } from "../controllers/book.controller.js";
import { Router } from "express";


const router = Router()

router.post("/booking",getBookTimes)
router.patch("/reserveBooking",reserveCourt)



export default router;