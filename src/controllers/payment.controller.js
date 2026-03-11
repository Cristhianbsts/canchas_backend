import { MercadoPagoConfig, Preference } from "mercadopago";
import Product from "../models/Product.js";
import Book from "../models/Book.js";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

/*
=========================
ARMAR ITEM DE PRODUCTO
=========================
*/
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

/*
=========================
ARMAR ITEM DE RESERVA
=========================
*/
const buildBookingPaymentItem = async (id) => {
  const booking = await Book.findById(id).populate("field");

  if (!booking) {
    const error = new Error("Reserva no encontrada");
    error.statusCode = 404;
    throw error;
  }

  if (!booking.field) {
    const error = new Error("Cancha no encontrada para esta reserva");
    error.statusCode = 404;
    throw error;
  }

  return {
    title: `Reserva cancha ${booking.field.name} ${booking.date} ${booking.time}`,
    quantity: 1,
    unit_price: booking.field.pricePerHour,
    currency_id: "ARS",
  };
};

/*
=========================
CREAR PREFERENCIA
=========================
*/
const createPayment = async (req, res) => {
  try {
    const { type, id, quantity = 1 } = req.body;

    let item = null;

    if (type === "product") {
      item = await buildProductPaymentItem(id, quantity);
    } else if (type === "booking") {
      item = await buildBookingPaymentItem(id);
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
          success: "http://localhost:5173/pago-exitoso",
          failure: "http://localhost:5173/pago-error",
          pending: "http://localhost:5173/pago-pendiente",
        },
        auto_return: "approved",
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
