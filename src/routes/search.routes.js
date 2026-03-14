import { Router } from "express";
import {
  searchProducts,
  searchCategories,
  searchAll,
} from "../controllers/search.controller.js";

import { validateSearchQuery } from "../middlewares/search.middleware.js";

const router = Router();

router.get("/products", validateSearchQuery, searchProducts);

router.get("/categories", validateSearchQuery, searchCategories);

router.get("/all", validateSearchQuery, searchAll);

export default router;