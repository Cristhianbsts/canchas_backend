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
import { authenticate } from "../middlewares/auth.middleware.js";

// Para cuando estén disponibles los middlewares
// import {isAdmin} from "../middlewares/role.middleware.js";

const router = Router();

router.get("/available", getAvailableTimes);
router.post("/", createBooking);
router.get("/my", getMyBookings);
router.get("/field/:field/:date", authenticate, getBookingsByIdAndDate);
router.get("/", getBookings);
// Va patch porque es más eficiente que put para actualizaciones pequeñas
router.patch("/:id/cancel", authenticate, cancelBooking);
router.delete("/:id", authenticate, deleteBooking);


export default router;