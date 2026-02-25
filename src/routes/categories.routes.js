import { Router } from "express";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  adminGetAllCategories,
} from "../controllers/categories.controller.js";

// FUTURO (cuando los tengas):
// import { validate } from "../middlewares/validate.middleware.js";
// import { requireAuth } from "../middlewares/auth.middleware.js";
// import { requireRole } from "../middlewares/role.middleware.js";
// import { createCategoryRules, updateCategoryRules, categoryIdParamRules } from "../validators/category.schemas.js";

const router = Router();

// Admin (por ahora público para test)
router.get("/admin/all", adminGetAllCategories);

// Públicos
router.get("/", getCategories);
router.get("/:id", getCategoryById);

// CRUD (por ahora público para test)
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;import { Router } from "express";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  adminGetAllCategories,
} from "../controllers/categories.controller.js";

// FUTURO (cuando los tengas):
// import { validate } from "../middlewares/validate.middleware.js";
// import { requireAuth } from "../middlewares/auth.middleware.js";
// import { requireRole } from "../middlewares/role.middleware.js";
// import { createCategoryRules, updateCategoryRules, categoryIdParamRules } from "../validators/category.schemas.js";

const router = Router();

// Admin (por ahora público para test)
router.get("/admin/all", adminGetAllCategories);

// Públicos
router.get("/", getCategories);
router.get("/:id", getCategoryById);

// CRUD (por ahora público para test)
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;