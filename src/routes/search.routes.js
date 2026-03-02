import { Router } from "express";
import { search } from "../controllers/search.controller.js";
import { handleValidationErrors } from "../middlewares/validator.js";
import {
  searchCollectionParamRules,
  searchTermParamRules,
  searchPaginationQueryRules,
} from "../validators/search.rules.js";

const router = Router();

// GET /search/:collection/:term?limit=10&offset=0
router.get(
  "/:collection/:term",
  [
    ...searchCollectionParamRules,
    ...searchTermParamRules,
    ...searchPaginationQueryRules,
    handleValidationErrors,
  ],
  search
);

export default router;