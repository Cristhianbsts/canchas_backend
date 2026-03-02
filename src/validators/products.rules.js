import { body, param } from "express-validator";

export const createProductRules = [
  body("name")
    .notEmpty()
    .withMessage("El nombre es obligatorio"),

  body("category")
    .notEmpty()
    .withMessage("La categoría es obligatoria")
    .isMongoId()
    .withMessage("No es un id de mongo válido"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El precio no puede ser menor a 0"),

  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("El stock no puede ser menor a 0"),
];

export const productIdParamRules = [
  param("id")
    .isMongoId()
    .withMessage("ID inválido"),
];