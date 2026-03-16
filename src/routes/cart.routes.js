import { Router } from "express";
import { authenticate } from "../middlewares/token.middleware.js";
import {
  getCart,
  addProductToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cart.controller.js";

const router = Router();

router.get("/", authenticate, getCart);
router.post("/", authenticate, addProductToCart);
router.put("/:productId", authenticate, updateCartItem);
router.delete("/:productId", authenticate, removeCartItem);
router.delete("/", authenticate, clearCart);

export default router;