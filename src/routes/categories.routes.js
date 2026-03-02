import { Router } from "express";
import { authenticate } from "../middlewares/auth.js";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categories.controller.js";

import {
  categoryIdParamRules,
  createCategoryRules,
  updateCategoryRules,
} from "../validators/category.rules.js";

import handleValidationErrors from "../middlewares/handleValidationErrors.js";
// Si vos ya tenés esto en ../middlewares/validator.js, importalo de ahí:
import { validateAdminRole } from "../middlewares/validator.js";

const router = Router();

router.get("/", getCategories);

router.post(
  "/",
  [
    authenticate,
    validateAdminRole,
    ...createCategoryRules,
    handleValidationErrors,
  ],
  createCategory
);

router.put(
  "/:id",
  [
    authenticate,
    validateAdminRole,
    ...categoryIdParamRules,
    ...updateCategoryRules,
    handleValidationErrors,
  ],
  updateCategory
);

router.delete(
  "/:id",
  [
    authenticate,
    validateAdminRole,
    ...categoryIdParamRules,
    handleValidationErrors,
  ],
  deleteCategory
);

export default router;