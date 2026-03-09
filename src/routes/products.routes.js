import { Router } from "express";
import { check, param, body } from "express-validator";
import { authenticate } from "../middlewares/auth.js";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import {
  handleValidationErrors,
  validateProductId,
} from "../middlewares/validator.js";

const router = Router();

router.get("/", getProducts);

router.post(
  "/",
  [
    authenticate,

    body("name", "El nombre es obligatorio")
      .notEmpty()
      .bail()
      .isString()
      .trim(),

    body("category")
      .notEmpty()
      .withMessage("La categoría es obligatoria")
      .bail()
      .isMongoId()
      .withMessage("No es un id de mongo válido"),

    body("price")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("El precio no puede ser menor a 0"),

    body("stock")
      .optional()
      .isInt({ min: 0 })
      .withMessage("El stock no puede ser menor a 0"),

    body("available")
      .optional()
      .isBoolean()
      .withMessage("Disponible debe ser booleano"),

    handleValidationErrors,
  ],
  createProduct
);

router.put(
  "/:id",
  [
    authenticate,

    param("id", "No es un id válido").isMongoId(),
    param("id").custom(validateProductId),

    body("name").optional().isString().trim(),
    body("category").optional().isMongoId().withMessage("No es un id de mongo válido"),

    body("price")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("El precio no puede ser menor a 0"),

    body("stock")
      .optional()
      .isInt({ min: 0 })
      .withMessage("El stock no puede ser menor a 0"),

    body("available")
      .optional()
      .isBoolean()
      .withMessage("Disponible debe ser booleano"),

    handleValidationErrors,
  ],
  updateProduct
);

router.delete(
  "/:id",
  [
    authenticate,

    param("id", "No es un id válido").isMongoId(),
    param("id").custom(validateProductId),

    handleValidationErrors,
  ],
  deleteProduct
);

export default router;