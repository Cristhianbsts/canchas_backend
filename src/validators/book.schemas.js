import Book from "../models/Book.js";
import Field from "../models/Field.js";

const validateField=async (field) => {
    const fieldExists = await Field.findById(field);
    if (!fieldExists || !fieldExists.active) {
        return res.status(404).json({
            ok:false,
            message: "No existe la cancha"
        })
    }
}

const validateBook= async (id) => {
    const bookExists = await Book.findById(id);
    if (!bookExists) {
        return res.status(404).json({
            ok:false,
            message: "No existe la reserva"
        })
    }
}

export {validateField, validateBook};