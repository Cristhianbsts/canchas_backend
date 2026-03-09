import { Router } from "express";
import { authenticate } from "../middlewares/token.middleware.js";
import { updateImageProduct } from "../controllers/upload.controller.js";
import { check } from "express-validator";
import { handleValidationErrors } from "../middlewares/error.middleware.js";
import { validateImageFile } from "../middlewares/upload.middleware.js";

const router = Router();

router.put(
  "/:id",
  [
    authenticate,
    //Validar rol 
    validateImageFile,
    check("id", "No es un id de mongo").isMongoId(),
    handleValidationErrors,
  ],

  updateImageProduct,
);

export default router;
