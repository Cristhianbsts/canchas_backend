import { Router } from "express";

import { authenticate } from "../middlewares/token.middleware.js";
import handleValidationErrors from "../middlewares/error.middleware.js";

import {
  validateCategoryId,
  validateCategoryNameExists,
  validateCategoryNameOnUpdate,
} from "../middlewares/categories.middleware.js";

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
} from "../validators/categories.rules.js";

const router = Router();

router.get("/", getCategories);

router.post(
  "/",
  [
    authenticate,
    ...createCategoryRules,
    handleValidationErrors,
    validateCategoryNameExists,
  ],
  createCategory
);

router.patch(
  "/:id",
  [
    authenticate,
    ...categoryIdParamRules,
    ...updateCategoryRules,
    handleValidationErrors,
    validateCategoryId,
    validateCategoryNameOnUpdate,
  ],
  updateCategory
);

router.delete(
  "/:id",
  [
    authenticate,
    ...categoryIdParamRules,
    handleValidationErrors,
    validateCategoryId,
  ],
  deleteCategory
);

export default router;