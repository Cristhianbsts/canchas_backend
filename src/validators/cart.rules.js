import { body, param } from "express-validator";

export const addProductToCartRules = [
  body("product")
    .notEmpty()
    .withMessage("El producto es obligatorio")
    .bail()
    .isMongoId()
    .withMessage("ID de producto inválido"),

  body("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("La cantidad debe ser mayor a 0"),
];

export const updateCartItemRules = [
  param("productId")
    .isMongoId()
    .withMessage("ID de producto inválido"),

  body("quantity")
    .notEmpty()
    .withMessage("La cantidad es obligatoria")
    .bail()
    .isInt({ min: 1 })
    .withMessage("La cantidad debe ser mayor a 0"),
];

export const cartProductParamRules = [
  param("productId")
    .isMongoId()
    .withMessage("ID de producto inválido"),
];