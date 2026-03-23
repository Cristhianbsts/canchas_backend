import { Router } from "express";

import { authenticate } from "../middlewares/token.middleware.js";
import { validarRolAdmin } from "../middlewares/rol.middleware.js";
import { handleValidationErrors } from "../middlewares/error.middleware.js";

import {
  validateCategoryId,
  validateCategoryNameExists,
  validateCategoryNameOnUpdate,
} from "../middlewares/categories.middleware.js";

import {
  getCategories,
  getAdminCategories,
  createCategory,
  updateCategory,
  activateCategory,
  deleteCategory,
} from "../controllers/categories.controller.js";

import {
  categoryIdParamRules,
  createCategoryRules,
  updateCategoryRules,
} from "../validators/categories.rules.js";

const router = Router();

router.get("/", getCategories);

router.get("/admin", [authenticate, validarRolAdmin], getAdminCategories);

router.post(
  "/",
  [
    authenticate,
    validarRolAdmin,
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
    validarRolAdmin,
    ...categoryIdParamRules,
    ...updateCategoryRules,
    handleValidationErrors,
    validateCategoryId,
    validateCategoryNameOnUpdate,
  ],
  updateCategory
);

router.patch(
  "/:id/activate",
  [
    authenticate,
    validarRolAdmin,
    ...categoryIdParamRules,
    handleValidationErrors,
    validateCategoryId,
  ],
  activateCategory
);

router.delete(
  "/:id",
  [
    authenticate,
    validarRolAdmin,
    ...categoryIdParamRules,
    handleValidationErrors,
    validateCategoryId,
  ],
  deleteCategory
);

export default router;
