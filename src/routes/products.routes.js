import { Router } from "express";

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  adminGetAllProducts,
} from "../controllers/products.controller.js";

// ✅ Usá el que exista en tu proyecto:
// import {
//   createProductRules,
//   updateProductRules,
//   productIdParamRules,
//   listProductsQueryRules,
// } from "../validators/product.schemas.js"; // (singular)

import {
  createProductRules,
  updateProductRules,
  productIdParamRules,
  listProductsQueryRules,
} from "../validators/products.schemas.js"; // (plural)

// ❌ Por ahora NO los tenés, dejalos comentados:
// import { validate } from "../middlewares/validate.middleware.js";
// import { requireAuth } from "../middlewares/auth.middleware.js";
// import { requireRole } from "../middlewares/role.middleware.js";

const router = Router();

/**
 * IMPORTANTE: rutas más específicas antes que "/:id"
 * (si no, "admin" entra como id)
 */

// Admin (por ahora público para test)
router.get("/admin/all", adminGetAllProducts);

/**
 * Públicos
 */
router.get("/", /* listProductsQueryRules, validate, */ getProducts);
router.get("/:id", /* productIdParamRules, validate, */ getProductById);

/**
 * CRUD (por ahora público para test)
 */
router.post("/", /* requireAuth, requireRole("ADMIN"), createProductRules, validate, */ createProduct);

router.put(
  "/:id",
  /* requireAuth, requireRole("ADMIN"), productIdParamRules, updateProductRules, validate, */
  updateProduct
);

router.delete(
  "/:id",
  /* requireAuth, requireRole("ADMIN"), productIdParamRules, validate, */
  deleteProduct
);

export default router;