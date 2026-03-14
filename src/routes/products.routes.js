import { Router } from "express";

import { authenticate } from "../middlewares/token.middleware.js";
import { handleValidationErrors } from "../middlewares/error.middleware.js";
import { validateProductId } from "../middlewares/products.middleware.js";

import {
  createProduct,
  getProducts,
  updateProduct,
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
    ...createProductRules,
    handleValidationErrors,
  ],
  createProduct
);

router.patch(
  "/:id",
  [
    authenticate,
    ...productIdParamRules,
    ...updateProductRules,
    handleValidationErrors,
    validateProductId,
  ],
  updateProduct
);

router.delete(
  "/:id",
  [
    authenticate,
    ...productIdParamRules,
    handleValidationErrors,
    validateProductId,
  ],
  deleteProduct
);

export default router;