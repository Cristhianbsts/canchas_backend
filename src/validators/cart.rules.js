import { body, param } from "express-validator";

export const cartProductIdParamRules = [
  param("productId")
    .notEmpty()
    .withMessage("Debe enviar el id")
    .bail()
    .isMongoId()
    .withMessage("Debe ser un id válido"),
];

export const addItemRules = [
  body("productId")
    .notEmpty()
    .withMessage("Debe enviar el id")
    .bail()
    .isMongoId()
    .withMessage("Debe ser un id válido"),

  body("quantity")
    .notEmpty()
    .withMessage("La cantidad no puede estar vacia")
    .bail()
    .isInt({ min: 1 })
    .withMessage("La cantidad debe ser mayor que 0"),
];

export const updateQuantityRules = [
  ...cartProductIdParamRules,

  body("quantity")
    .notEmpty()
    .withMessage("La cantidad no puede estar vacia")
    .bail()
    .isInt({ min: 1 })
    .withMessage("La cantidad debe ser mayor que 0"),
];