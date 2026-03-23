import { Router } from "express";

import { authenticate } from "../middlewares/token.middleware.js";
import { validarRolAdmin } from "../middlewares/rol.middleware.js";
import { handleValidationErrors } from "../middlewares/error.middleware.js";
import { validateProductId } from "../middlewares/products.middleware.js";

import {
  createProduct,
  getProducts,
  updateProduct,
  activateProduct,
  deleteProduct,
} from "../controllers/products.controller.js";

import {
  productIdParamRules,
  createProductRules,
  updateProductRules,
} from "../validators/products.rules.js";

const router = Router();

router.get("/", getProducts);

router.post(
  "/",
  [
    authenticate,
    validarRolAdmin,
    ...createProductRules,
    handleValidationErrors,
  ],
  createProduct
);

router.patch(
  "/:id",
  [
    authenticate,
    validarRolAdmin,
    ...productIdParamRules,
    ...updateProductRules,
    handleValidationErrors,
    validateProductId,
  ],
  updateProduct
);

router.patch(
  "/:id/activate",
  [
    authenticate,
    validarRolAdmin,
    ...productIdParamRules,
    handleValidationErrors,
    validateProductId,
  ],
  activateProduct
);

router.delete(
  "/:id",
  [
    authenticate,
    validarRolAdmin,
    ...productIdParamRules,
    handleValidationErrors,
    validateProductId,
  ],
  deleteProduct
);

export default router;
