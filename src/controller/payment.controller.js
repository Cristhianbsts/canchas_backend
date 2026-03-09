import { MercadoPagoConfig, Preference } from "mercadopago";
import Product from "../models/Product.js";
import Book from "../models/Book.js";

const client = new MercadoPagoConfig({
  accessToken: process.env.YOUR_ACCESS_TOKEN,
});

const createPayment = async (req, res) => {
  try {

    const { type, id, quantity = 1 } = req.body;

    let item = null;

    /*
    =========================
    PAGO DE PRODUCTOS
    =========================
    */

    if (type === "product") {

      const product = await Product.findById(id);

      if (!product || product.active === false) {
        return res.status(404).json({
          ok:false,
          msg:"Producto no encontrado"
        });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          ok:false,
          msg:"Stock insuficiente"
        });
      }

      item = {
        title: product.name,
        quantity: quantity,
        unit_price: product.price,
        currency_id: "ARS"
      };

    }

    /*
    =========================
    PAGO DE RESERVA
    =========================
    */

    if (type === "booking") {

      const booking = await Book.findById(id).populate("field");

      if (!booking) {
        return res.status(404).json({
          ok:false,
          msg:"Reserva no encontrada"
        });
      }

      item = {
        title: `Reserva cancha ${booking.field?.name || ""} ${booking.date} ${booking.time}`,
        quantity: 1,
        unit_price: 5000, 
        currency_id: "ARS"
      };

    }

    /*
    =========================
    CREAR PREFERENCIA
    =========================
    */

    const preference = new Preference(client);

    const result = await preference.create({
      body:{
        items:[item],
        back_urls:{
          success:"http://localhost:5173/pago-exitoso",
          failure:"http://localhost:5173/pago-error",
          pending:"http://localhost:5173/pago-pendiente"
        },
        auto_return:"approved"
      }
    });

    res.status(200).json({
      ok:true,
      id: result.id,
      url: result.init_point
    });

  } catch (error) {

    res.status(500).json({
      ok:false,
      error:error.message
    });

  }
};

export { createPayment };