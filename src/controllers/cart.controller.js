import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// GET /cart -> traer items del carrito del usuario
const getItems = async (req, res) => {
  try {
    const userId = req.user._id;

    let cart = await Cart.findOne({ user: userId }).populate(
      "items.product",
      "name price stock status image"
    );

    if (!cart) {
      cart = await Cart.create({ user: userId, items: [], total: 0 });
    }

    res.status(200).json({
      ok: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

// POST /cart -> agregar item
const addItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    const qty = Number(quantity);

    const product = await Product.findById(productId);
    if (!product || product.status === false) {
      return res.status(404).json({ ok: false, message: "No existe el producto" });
    }

    if (product.stock < qty) {
      return res.status(400).json({ ok: false, message: "Stock insuficiente" });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [], total: 0 });
    }

    const existingIndex = cart.items.findIndex(
      (item) => String(item.product) === String(productId)
    );

    if (existingIndex >= 0) {
      const newQty = cart.items[existingIndex].quantity + qty;

      if (product.stock < newQty) {
        return res.status(400).json({ ok: false, message: "Stock insuficiente" });
      }

      cart.items[existingIndex].quantity = newQty;
      cart.items[existingIndex].unitPrice = product.price; // actualiza precio unitario al precio actual
    } else {
      cart.items.push({
        product: productId,
        quantity: qty,
        unitPrice: product.price,
      });
    }

    cart.calculateTotal();
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate(
      "items.product",
      "name price stock status image"
    );

    res.status(200).json({
      ok: true,
      message: "Item agregado al carrito",
      cart: populatedCart,
    });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

// PUT /cart/:productId -> actualizar cantidad
const updateQuantity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const { quantity } = req.body;

    const qty = Number(quantity);

    const product = await Product.findById(productId);
    if (!product || product.status === false) {
      return res.status(404).json({ ok: false, message: "No existe el producto" });
    }

    if (product.stock < qty) {
      return res.status(400).json({ ok: false, message: "Stock insuficiente" });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ ok: false, message: "Carrito no encontrado" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => String(item.product) === String(productId)
    );

    if (itemIndex < 0) {
      return res.status(404).json({ ok: false, message: "El producto no está en el carrito" });
    }

    cart.items[itemIndex].quantity = qty;
    cart.items[itemIndex].unitPrice = product.price;

    cart.calculateTotal();
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate(
      "items.product",
      "name price stock status image"
    );

    res.status(200).json({
      ok: true,
      message: "Cantidad actualizada",
      cart: populatedCart,
    });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

// DELETE /cart/:productId -> borrar un item
const deleteItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ ok: false, message: "Carrito no encontrado" });
    }

    const initialLength = cart.items.length;

    cart.items = cart.items.filter(
      (item) => String(item.product) !== String(productId)
    );

    if (cart.items.length === initialLength) {
      return res.status(404).json({ ok: false, message: "El producto no está en el carrito" });
    }

    cart.calculateTotal();
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate(
      "items.product",
      "name price stock status image"
    );

    res.status(200).json({
      ok: true,
      message: "Item eliminado",
      cart: populatedCart,
    });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

// DELETE /cart -> borrar carrito (vaciar)
const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ ok: false, message: "Carrito no encontrado" });
    }

    cart.items = [];
    cart.total = 0;

    await cart.save();

    res.status(200).json({
      ok: true,
      message: "Carrito eliminado",
      cart,
    });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

export { getItems, addItem, updateQuantity, deleteItem, clearCart };