import { Schema, model } from "mongoose";

// los items del carrito
// id del producto
// cantidad
// precio unitario

const CartItemSchema = new Schema(
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
    unitPrice: {
      type: Number,
      required: true,
      min: [0, "El precio unitario no puede ser menor a 0"],
    },
  },
  { _id: false }
);

// el carrito
// id del usuario
// items
// total
// fecha de creación

const CartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: {
      type: [CartItemSchema],
      default: [],
    },
    total: {
      type: Number,
      default: 0,
      min: [0, "El total no puede ser menor a 0"],
    },
  },
  { timestamps: true, versionKey: false }
);

CartSchema.methods.calculateTotal = function () {
  this.total = this.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  return this.total;
};

export default model("Cart", CartSchema);