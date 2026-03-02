import { getBookTimes, reserveCourt } from "../controllers/book.controller.js";
import router from "./ruteRegister.js";


router.post("/booking",getBookTimes)
router.put("/reserveBooking",reserveCourt)



export default router;