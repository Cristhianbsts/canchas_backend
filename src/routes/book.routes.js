import { Router } from "express";
import {
    getAvailableTimes,
    createBooking,
    getBookings,
    getMyBookings,
    getBookingsByIdAndDate,
    cancelBooking,
    deleteBooking
} from "../controllers/book.controller.js";

// Para cuando estén disponibles los middlewares
// import auth from "../middlewares/auth.js";
// import {isAdmin} from "../middlewares/role.middleware.js";

const router = Router();

router.get("/available", getAvailableTimes);
router.post("/", createBooking);
router.get("/my", getMyBookings);
router.get("/field/:field/:date", getBookingsByIdAndDate);
router.get("/", getBookings);
// Va patch porque es más eficiente que put para actualizaciones pequeñas
router.patch("/:id/cancel", cancelBooking);
router.delete("/:id", deleteBooking);


export default router;