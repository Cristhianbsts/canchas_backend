import { Schema, model } from "mongoose";

const cartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],

    active: {
      type: Boolean,
      default: true,
    },

    paymentProcessed: {
      type: Boolean,
      default: false,
    },

    // opcional pero útil: guarda la preferencia generada en Mercado Pago
    mpPreferenceId: {
      type: String,
      default: null,
    },

    // opcional pero útil: guarda el id del pago aprobado
    mpPaymentId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Cart", cartSchema);