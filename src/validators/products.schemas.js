import { body, param, query } from "express-validator";

export const productIdParamRules = [
  param("id")
    .isMongoId()
    .withMessage("El id del producto debe ser un MongoID válido"),
];

export const createProductRules = [
  body("name")
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isLength({ min: 2, max: 80 })
    .withMessage("El nombre debe tener entre 2 y 80 caracteres"),

  body("description")
    .optional()
    .isString()
    .withMessage("La descripción debe ser texto")
    .isLength({ max: 500 })
    .withMessage("La descripción no puede superar 500 caracteres"),

  body("price")
    .notEmpty()
    .withMessage("El precio es obligatorio")
    .isFloat({ min: 0 })
    .withMessage("El precio debe ser un número >= 0"),

  body("stock")
    .notEmpty()
    .withMessage("El stock es obligatorio")
    .isInt({ min: 0 })
    .withMessage("El stock debe ser un entero >= 0"),

  body("category")
    .optional()
    .isString()
    .withMessage("La categoría debe ser texto")
    .isLength({ max: 40 })
    .withMessage("La categoría no puede superar 40 caracteres"),

  body("image")
    .optional()
    .isString()
    .withMessage("La imagen debe ser texto (url/path)"),

  body("active")
    .optional()
    .isBoolean()
    .withMessage("active debe ser boolean"),
];

export const updateProductRules = [
  // En update, todo opcional, pero si viene debe ser válido
  body("name")
    .optional()
    .isLength({ min: 2, max: 80 })
    .withMessage("El nombre debe tener entre 2 y 80 caracteres"),

  body("description")
    .optional()
    .isString()
    .withMessage("La descripción debe ser texto")
    .isLength({ max: 500 })
    .withMessage("La descripción no puede superar 500 caracteres"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El precio debe ser un número >= 0"),

  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("El stock debe ser un entero >= 0"),

  body("category")
    .optional()
    .isString()
    .withMessage("La categoría debe ser texto")
    .isLength({ max: 40 })
    .withMessage("La categoría no puede superar 40 caracteres"),

  body("image")
    .optional()
    .isString()
    .withMessage("La imagen debe ser texto (url/path)"),

  body("active")
    .optional()
    .isBoolean()
    .withMessage("active debe ser boolean"),
];

// Opcional: validación de queries públicas
export const listProductsQueryRules = [
  query("q").optional().isString().withMessage("q debe ser texto"),
  query("category").optional().isString().withMessage("category debe ser texto"),
  query("minPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("minPrice debe ser número >= 0"),
  query("maxPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("maxPrice debe ser número >= 0"),
];