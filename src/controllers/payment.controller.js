import { MercadoPagoConfig, Preference } from "mercadopago";
import Product from "../models/Product.js";
import Book from "../models/Book.js";
import Cart from "../models/Cart.js";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

const buildProductPaymentItem = async (id, quantity = 1) => {
  const product = await Product.findById(id);

  if (!product || product.active === false) {
    const error = new Error("Producto no encontrado");
    error.statusCode = 404;
    throw error;
  }

  if (product.stock < quantity) {
    const error = new Error("Stock insuficiente");
    error.statusCode = 400;
    throw error;
  }

  return {
    title: product.name,
    quantity,
    unit_price: product.price,
    currency_id: "ARS",
  };
};

const buildBookingPaymentItem = async (id, userId) => {
  const booking = await Book.findById(id).populate("field");

  if (!booking) {
    const error = new Error("Reserva no encontrada");
    error.statusCode = 404;
    throw error;
  }

  if (!booking.field) {
    const error = new Error("La reserva no tiene una cancha asociada");
    error.statusCode = 400;
    throw error;
  }

  const reservedByUser =
    booking.time18hs?.user?.toString() === userId.toString() ||
    booking.time19hs?.user?.toString() === userId.toString() ||
    booking.time20hs?.user?.toString() === userId.toString() ||
    booking.time21hs?.user?.toString() === userId.toString() ||
    booking.time22hs?.user?.toString() === userId.toString() ||
    booking.time23hs?.user?.toString() === userId.toString();

  if (!reservedByUser) {
    const error = new Error("No tienes permiso para pagar esta reserva");
    error.statusCode = 403;
    throw error;
  }

  if (typeof booking.price !== "number" || booking.price <= 0) {
    const error = new Error("La reserva no tiene un precio válido");
    error.statusCode = 400;
    throw error;
  }

  return {
    title: `Reserva cancha ${booking.field.name} - ${new Date(
      booking.date
    ).toLocaleDateString("es-AR")}`,
    quantity: 1,
    unit_price: booking.price,
    currency_id: "ARS",
  };
};

// NUEVO: arma todos los items del carrito
const buildCartPaymentItems = async (userId) => {
  const cart = await Cart.findOne({ user: userId, active: true }).populate({
    path: "items.product",
    select: "name price stock active",
  });

  if (!cart || !cart.items.length) {
    const error = new Error("El carrito está vacío");
    error.statusCode = 400;
    throw error;
  }

  const items = [];

  for (const item of cart.items) {
    const product = item.product;

    if (!product || product.active === false) {
      const error = new Error("Hay productos inválidos en el carrito");
      error.statusCode = 400;
      throw error;
    }

    if (product.stock < item.quantity) {
      const error = new Error(`Stock insuficiente para ${product.name}`);
      error.statusCode = 400;
      throw error;
    }

    items.push({
      title: product.name,
      quantity: item.quantity,
      unit_price: product.price,
      currency_id: "ARS",
    });
  }

  return items;
};

const createPayment = async (req, res) => {
  try {
    const { type, id, quantity = 1, userId } = req.body || {};

    if (!type) {
      return res.status(400).json({
        ok: false,
        msg: "Debes enviar type",
      });
    }

    let items = [];

    if (type === "product") {
      if (!id) {
        return res.status(400).json({
          ok: false,
          msg: "Debes enviar id del producto",
        });
      }

      const item = await buildProductPaymentItem(id, quantity);
      items = [item];
    } else if (type === "booking") {
      if (!id || !userId) {
        return res.status(400).json({
          ok: false,
          msg: "Debes enviar id y userId para pagar una reserva",
        });
      }

      const item = await buildBookingPaymentItem(id, userId);
      items = [item];
    } else if (type === "cart") {
      // toma el usuario autenticado desde el token
      items = await buildCartPaymentItems(req.user._id);
    } else {
      return res.status(400).json({
        ok: false,
        msg: "Tipo de pago no válido",
      });
    }

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items,
        back_urls: {
          success: "http://localhost:3001/pago-exitoso",
          failure: "http://localhost:3001/pago-error",
          pending: "http://localhost:3001/pago-pendiente",
        },
        // auto_return: "approved",
      },
    });

    return res.status(200).json({
      ok: true,
      id: result.id,
      url: result.init_point,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      ok: false,
      msg: error.message || "Error interno del servidor",
    });
  }
};

// ---------------------------------------------------
// FUNCIÓN APARTE: descuenta stock cuando el pago fue aprobado
// ---------------------------------------------------
const processApprovedCartPayment = async (userId) => {
  // Busca el carrito activo del usuario
  const cart = await Cart.findOne({ user: userId, active: true }).populate({
    path: "items.product",
  });

  if (!cart) {
    const error = new Error("Carrito no encontrado");
    error.statusCode = 404;
    throw error;
  }

  if (!cart.items || cart.items.length === 0) {
    const error = new Error("El carrito está vacío");
    error.statusCode = 400;
    throw error;
  }

  // Si ya fue procesado antes, no volver a descontar
  if (cart.paymentProcessed === true) {
    return {
      ok: true,
      message: "El pago ya fue procesado anteriormente",
    };
  }

  // 1. Validar stock antes de tocar nada
  for (const item of cart.items) {
    const product = await Product.findById(item.product._id);

    if (!product) {
      const error = new Error(`Producto no encontrado`);
      error.statusCode = 404;
      throw error;
    }

    if (product.stock < item.quantity) {
      const error = new Error(
        `Stock insuficiente para el producto ${product.name}`
      );
      error.statusCode = 400;
      throw error;
    }
  }

  // 2. Descontar stock
  for (const item of cart.items) {
    const product = await Product.findById(item.product._id);

    product.stock -= item.quantity;
    await product.save();
  }

  // 3. Marcar carrito como procesado / cerrado
  cart.paymentProcessed = true;
  cart.active = false;
  await cart.save();

  return {
    ok: true,
    message: "Pago procesado y stock actualizado correctamente",
  };
};

export { createPayment,processApprovedCartPayment };