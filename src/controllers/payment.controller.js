import { MercadoPagoConfig, Preference } from "mercadopago";
import Product from "../models/Product.js";
import Book from "../models/Book.js";
import Field from "../models/Field.js";

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
    quantity: quantity,
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

const createPayment = async (req, res) => {
  try {
    const { type, id, quantity = 1, userId } = req.body || {};

    if (!type || !id) {
      return res.status(400).json({
        ok: false,
        msg: "Debes enviar type e id",
      });
    }

    let item = null;

    if (type === "product") {
      item = await buildProductPaymentItem(id, quantity);
    } else if (type === "booking") {
      if (!userId) {
        return res.status(400).json({
          ok: false,
          msg: "Debes enviar userId para pagar una reserva",
        });
      }

      item = await buildBookingPaymentItem(id, userId);
    } else {
      return res.status(400).json({
        ok: false,
        msg: "Tipo de pago no válido",
      });
    }

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [item],
        back_urls: {
          success: "http://localhost:3002/pago-exitoso.html",
          failure: "http://localhost:3002/pago-error",
          pending: "http://localhost:3002/pago-pendiente",
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

export { createPayment };