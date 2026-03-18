import { Router } from "express";
import { authenticate } from "../middlewares/token.middleware.js";
import { updateImageField, updateImageProduct } from "../controllers/upload.controller.js";
import { check } from "express-validator";
import { handleValidationErrors } from "../middlewares/error.middleware.js";
import { validateImageFile } from "../middlewares/upload.middleware.js";

const router = Router();

router.put(
  "/product/:id",
  [
    authenticate,
    validateImageFile,
    check("id", "No es un id de mongo").isMongoId(),
    handleValidationErrors,
  ],

  updateImageProduct,
);
router.put(
  "/field/:id",
  [
    authenticate,
    validateImageFile,
    check("id", "No es un id de mongo").isMongoId(),
    handleValidationErrors,
  ],

  updateImageField,
);
export default router;
