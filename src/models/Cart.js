import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "El producto es obligatorio"],
    },
    quantity: {
      type: Number,
      required: [true, "La cantidad es obligatoria"],
      min: [1, "La cantidad mínima es 1"],
      default: 1,
    },
    price: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      min: [0, "El precio no puede ser negativo"],
    },
    subtotal: {
      type: Number,
      required: true,
      min: [0, "El subtotal no puede ser negativo"],
    },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El usuario es obligatorio"],
      unique: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
    total: {
      type: Number,
      default: 0,
      min: [0, "El total no puede ser negativo"],
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, autoIndex: true }
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;