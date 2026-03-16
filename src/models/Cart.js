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
    mpPreferenceId: {
      type: String,
      default: null,
    },
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