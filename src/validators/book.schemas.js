import {check, param} from "express-validator";
import { parse, isValid } from "date-fns";

const validateId = [
    param("id")
    .isMongoId().withMessage("El id no es un id válido")
    .notEmpty().withMessage("El id es obligatorio")
];

const validateField = [
    check("field")
    .notEmpty().withMessage("La cancha es obligatoria")
    .isMongoId().withMessage("El id no es un id válido")
];

const validateDate = [
    check("date")
    .notEmpty().withMessage("La fecha es obligatoria")
    .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage("Formato de fecha inválido (yyyy-MM-dd)")
    .custom((value) => {
        const parsed = parse(value, "yyyy-MM-dd", new Date());
        if (!isValid(parsed)) {
            throw new Error("La fecha es inválida");
        }
        return true;
    })
];

const validateTime = [
    check("time")
    .notEmpty().withMessage("La hora es obligatoria")
    .matches(/^([01]\d|2[0-3]):00$/).withMessage("Formato de hora inválido (HH:00)")
];

export {validateDate, validateField, validateId, validateTime}