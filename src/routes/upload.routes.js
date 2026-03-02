import { Router } from "express";
import { authenticate } from "../middlewares/auth.js";
import { handleValidationErrors } from "../middlewares/validator.js";
import { updateProductImage } from "../controllers/upload.controller.js";
import { uploadProductImageRules } from "../validators/upload.rules.js";

const router = Router();

router.put(
  "/products/:id",
  [
    authenticate,
    ...uploadProductImageRules,
    handleValidationErrors,
  ],
  updateProductImage
);

export default router;