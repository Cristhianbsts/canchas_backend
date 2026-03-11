import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const validateCart = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId, active: true });

    if (!cart) {
      return res.status(404).json({
        ok: false,
        message: "Carrito no encontrado",
      });
    }

    req.cart = cart;
    next();
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

const validateCartProduct = async (req, res, next) => {
  try {
    const productId = req.body.product || req.params.productId;

    const product = await Product.findById(productId);

    if (!product || product.active === false) {
      return res.status(404).json({
        ok: false,
        message: "Producto no encontrado",
      });
    }

    req.product = product;
    next();
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

const validateCartItem = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: userId, active: true });

    if (!cart) {
      return res.status(404).json({
        ok: false,
        message: "Carrito no encontrado",
      });
    }

    const item = cart.items.find(
      (cartItem) => cartItem.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        ok: false,
        message: "Producto no encontrado en el carrito",
      });
    }

    req.cart = cart;
    req.cartItem = item;
    next();
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

export {
  validateCart,
  validateCartProduct,
  validateCartItem,
};