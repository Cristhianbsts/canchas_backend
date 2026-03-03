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
import { validateDate, validateField, validateTime, validateId } from "../validators/book.schemas.js";
import {handleValidationErrors} from "../middlewares/error.middleware.js"

// Para cuando estén disponibles los middlewares
// import {isAdmin} from "../middlewares/role.middleware.js";

const router = Router();

router.get("/available", validateField, validateDate, handleValidationErrors, getAvailableTimes);
router.post("/", authenticate, validateField, validateDate, validateTime, handleValidationErrors, createBooking);
router.get("/my", authenticate, handleValidationErrors, getMyBookings);
router.get("/field", authenticate, validateField, validateDate, handleValidationErrors, getBookingsByIdAndDate);
router.get("/", getBookings);
// Va patch porque es más eficiente que put para actualizaciones pequeñas
router.patch("/:id/cancel", authenticate, validateId, handleValidationErrors, cancelBooking);
router.delete("/:id", authenticate, validateId, handleValidationErrors, deleteBooking);

export default router;