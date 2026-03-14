import { body, param } from "express-validator";

export const categoryIdParamRules = [
  param("id").isMongoId().withMessage("ID inválido"),
];

export const createCategoryRules = [
  body("name")
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .bail()
    .isString()
    .trim()
    .isLength({ min: 2, max: 40 })
    .withMessage("Nombre inválido"),
];

export const updateCategoryRules = [
  body("name")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 40 })
    .withMessage("Nombre inválido"),
];