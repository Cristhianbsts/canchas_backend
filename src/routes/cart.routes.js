import { Router } from "express";

import { authenticate } from "../middlewares/token.middleware.js";
import handleValidationErrors from "../middlewares/error.middleware.js";

import {
  validateCart,
  validateCartProduct,
  validateCartItem,
} from "../middlewares/cart.middleware.js";

import {
  getCart,
  addProductToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cart.controller.js";

import {
  addProductToCartRules,
  updateCartItemRules,
  cartProductParamRules,
} from "../validators/cart.rules.js";

const router = Router();

router.get(
  "/",
  [
    authenticate,
  ],
  getCart
);

router.post(
  "/",
  [
    authenticate,
    ...addProductToCartRules,
    handleValidationErrors,
    validateCartProduct,
  ],
  addProductToCart
);

router.patch(
  "/:productId",
  [
    authenticate,
    ...updateCartItemRules,
    handleValidationErrors,
    validateCartItem,
  ],
  updateCartItem
);

router.delete(
  "/:productId",
  [
    authenticate,
    ...cartProductParamRules,
    handleValidationErrors,
    validateCartItem,
  ],
  removeCartItem
);

router.delete(
  "/",
  [
    authenticate,
    validateCart,
  ],
  clearCart
);

export default router;