import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const recalculateCart = (items) => {
  return items.reduce((total, item) => total + item.subtotal, 0);
};

const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    let cart = await Cart.findOne({ user: userId, active: true }).populate({
      path: "items.product",
      select: "name image price stock active category",
      populate: {
        path: "category",
        select: "name",
      },
    });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [],
        total: 0,
      });
    }

    res.json({
      ok: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

const addProductToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { product: productId, quantity = 1 } = req.body;

    const itemQuantity = Number(quantity);

    const product = await Product.findById(productId);

    if (!product || product.active === false) {
      return res.status(404).json({
        ok: false,
        message: "Producto no encontrado",
      });
    }

    if (itemQuantity < 1) {
      return res.status(400).json({
        ok: false,
        message: "La cantidad debe ser mayor a 0",
      });
    }

    if (product.stock < itemQuantity) {
      return res.status(400).json({
        ok: false,
        message: "Stock insuficiente",
      });
    }

    let cart = await Cart.findOne({ user: userId, active: true });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [],
        total: 0,
      });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + itemQuantity;

      if (product.stock < newQuantity) {
        return res.status(400).json({
          ok: false,
          message: "Stock insuficiente",
        });
      }

      existingItem.quantity = newQuantity;
      existingItem.price = product.price;
      existingItem.subtotal = newQuantity * product.price;
    } else {
      cart.items.push({
        product: product._id,
        quantity: itemQuantity,
        price: product.price,
        subtotal: itemQuantity * product.price,
      });
    }

    cart.total = recalculateCart(cart.items);

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate({
      path: "items.product",
      select: "name image price stock active category",
      populate: {
        path: "category",
        select: "name",
      },
    });

    res.status(201).json({
      ok: true,
      message: "Producto agregado al carrito",
      cart: updatedCart,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const { quantity } = req.body;

    const itemQuantity = Number(quantity);

    if (itemQuantity < 1) {
      return res.status(400).json({
        ok: false,
        message: "La cantidad debe ser mayor a 0",
      });
    }

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

    const product = await Product.findById(productId);

    if (!product || product.active === false) {
      return res.status(404).json({
        ok: false,
        message: "Producto no encontrado",
      });
    }

    if (product.stock < itemQuantity) {
      return res.status(400).json({
        ok: false,
        message: "Stock insuficiente",
      });
    }

    item.quantity = itemQuantity;
    item.price = product.price;
    item.subtotal = itemQuantity * product.price;

    cart.total = recalculateCart(cart.items);

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate({
      path: "items.product",
      select: "name image price stock active category",
      populate: {
        path: "category",
        select: "name",
      },
    });

    res.json({
      ok: true,
      message: "Carrito actualizado",
      cart: updatedCart,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

const removeCartItem = async (req, res) => {
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

    const itemExists = cart.items.some(
      (item) => item.product.toString() === productId
    );

    if (!itemExists) {
      return res.status(404).json({
        ok: false,
        message: "Producto no encontrado en el carrito",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    cart.total = recalculateCart(cart.items);

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate({
      path: "items.product",
      select: "name image price stock active category",
      populate: {
        path: "category",
        select: "name",
      },
    });

    res.json({
      ok: true,
      message: "Producto eliminado del carrito",
      cart: updatedCart,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId, active: true });

    if (!cart) {
      return res.status(404).json({
        ok: false,
        message: "Carrito no encontrado",
      });
    }

    cart.items = [];
    cart.total = 0;

    await cart.save();

    res.json({
      ok: true,
      message: "Carrito vaciado",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

export {
  getCart,
  addProductToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};