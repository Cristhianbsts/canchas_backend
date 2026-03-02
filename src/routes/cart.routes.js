import { Router } from "express";
import { authenticate } from "../middlewares/auth.js";
import { handleValidationErrors } from "../middlewares/validator.js";

import {
  addItemRules,
  updateQuantityRules,
  cartProductIdParamRules,
} from "../validators/cart.rules.js";

import {
  traerItems as getCartItems,
  agregarItem as addItem,
  actualizarCantidad as updateQuantity,
  borrarItem as deleteItem,
  borrarCarrito as clearCart,
} from "../controllers/cart.controller.js";

const router = Router();

router.get("/", authenticate, getCartItems);

router.post(
  "/",
  [
    authenticate,
    ...addItemRules,
    handleValidationErrors,
  ],
  addItem
);

router.put(
  "/:productId",
  [
    authenticate,
    ...updateQuantityRules,
    handleValidationErrors,
  ],
  updateQuantity
);

router.delete(
  "/:productId",
  [
    authenticate,
    ...cartProductIdParamRules,
    handleValidationErrors,
  ],
  deleteItem
);

router.delete("/", authenticate, clearCart);

export default router;