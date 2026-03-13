import { body, param } from "express-validator";

export const productIdParamRules = [
  param("id").isMongoId().withMessage("ID inválido"),
];

export const createProductRules = [
  body("name")
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .bail()
    .isString()
    .trim(),

  body("category")
    .notEmpty()
    .withMessage("La categoría es obligatoria")
    .bail()
    .isMongoId()
    .withMessage("Categoría inválida"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El precio no puede ser menor a 0"),

  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("El stock no puede ser menor a 0"),
];

export const updateProductRules = [
  body("name")
    .optional()
    .isString()
    .trim(),

  body("category")
    .optional()
    .isMongoId()
    .withMessage("Categoría inválida"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El precio no puede ser menor a 0"),

  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("El stock no puede ser menor a 0"),
];