import {body} from "express-validator"

export const validateNodemailer = [
    body('nombre')
        .notEmpty().withMessage('El nombre es obligatorio')
        .trim()
        .escape(),
    body('email')
        .trim()
        .isEmail().withMessage('Debes ingresar un email válido')
        .normalizeEmail(),
    body('telefono')
        .optional({ checkFalsy: true })
        .isNumeric().withMessage('El teléfono solo debe contener números'),
    body('mensaje')
        .isLength({ min: 10 }).withMessage('El mensaje debe tener al menos 10 caracteres')
        .trim()
        .escape()
]