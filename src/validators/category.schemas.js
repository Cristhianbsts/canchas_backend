import { body, param } from "express-validator";

export const categoryIdParamRules = [
  param("id").isMongoId().withMessage("ID inválido"),
];

export const createCategoryRules = [
  body("name").isString().trim().isLength({ min: 2, max: 40 }).withMessage("Nombre inválido"),
  // slug opcional: si no lo mandás, igual se genera con el setter si lo envías
  body("slug").optional().isString().trim().isLength({ min: 2, max: 60 }).withMessage("Slug inválido"),
];

export const updateCategoryRules = [
  body("name").optional().isString().trim().isLength({ min: 2, max: 40 }),
  body("slug").optional().isString().trim().isLength({ min: 2, max: 60 }),
  body("active").optional().isBoolean(),
];