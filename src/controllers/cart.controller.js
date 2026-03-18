import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const CART_POPULATE = {
  path: "items.product",
  select: "name image images price stock active category",
  populate: {
    path: "category",
    select: "name",
  },
};

const formatCartResponse = (cart) => {
  if (!cart) {
    return {
      _id: null,
      user: null,
      items: [],
      totalItems: 0,
      totalQuantity: 0,
      totalAmount: 0,
      active: true,
      paymentProcessed: false,
      createdAt: null,
      updatedAt: null,
    };
  }

  const items = (cart.items || [])
    .filter((item) => item.product)
    .map((item) => {
      const product = item.product;
      const quantity = Number(item.quantity) || 0;
      const price = Number(product.price) || 0;
      const subtotal = quantity * price;
      const image = product.image || product.images?.[0] || "";

      return {
        _id: item._id,
        product: {
          _id: product._id,
          name: product.name,
          image,
          images: product.images || [],
          price,
          stock: product.stock,
          active: product.active,
          category: product.category || null,
        },
        quantity,
        subtotal,
      };
    });

  const totalAmount = items.reduce((acc, item) => acc + item.subtotal, 0);
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

  return {
    _id: cart._id,
    user: cart.user,
    items,
    totalItems: items.length,
    totalQuantity,
    totalAmount,
    active: cart.active,
    paymentProcessed: cart.paymentProcessed,
    createdAt: cart.createdAt,
    updatedAt: cart.updatedAt,
  };
};

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId, active: true }).populate(
    CART_POPULATE
  );

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [],
    });

    cart = await Cart.findById(cart._id).populate(CART_POPULATE);
  }

  return cart;
};

const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await getOrCreateCart(userId);

    return res.json({
      ok: true,
      cart: formatCartResponse(cart),
    });
  } catch (error) {
    return res.status(500).json({
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

    if (!Number.isInteger(itemQuantity) || itemQuantity < 1) {
      return res.status(400).json({
        ok: false,
        message: "La cantidad debe ser mayor a 0",
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

    let cart = await Cart.findOne({ user: userId, active: true });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [],
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
    } else {
      cart.items.push({
        product: product._id,
        quantity: itemQuantity,
      });
    }

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate(CART_POPULATE);

    return res.status(201).json({
      ok: true,
      message: "Producto agregado al carrito",
      cart: formatCartResponse(updatedCart),
    });
  } catch (error) {
    return res.status(500).json({
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

    if (!Number.isInteger(itemQuantity) || itemQuantity < 1) {
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

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate(CART_POPULATE);

    return res.json({
      ok: true,
      message: "Carrito actualizado",
      cart: formatCartResponse(updatedCart),
    });
  } catch (error) {
    return res.status(500).json({
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

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate(CART_POPULATE);

    return res.json({
      ok: true,
      message: "Producto eliminado del carrito",
      cart: formatCartResponse(updatedCart),
    });
  } catch (error) {
    return res.status(500).json({
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

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate(CART_POPULATE);

    return res.json({
      ok: true,
      message: "Carrito vaciado",
      cart: formatCartResponse(updatedCart),
    });
  } catch (error) {
    return res.status(500).json({
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