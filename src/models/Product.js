import { Schema, model } from "mongoose";

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      unique: true,
      trim: true,
    },

    status: {
      type: Boolean,
      default: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    price: {
      type: Number,
      default: 0,
      min: [0, "El precio no puede ser menor a 0"],
    },

    stock: {
      type: Number,
      default: 0,
      min: [0, "El stock no puede ser menor a 0"],
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    available: {
      type: Boolean,
      default: true,
    },

    image: {
      type: String,
      default:
        "https://imgs.search.brave.com/_TVJChU0ZD9PH6uYI3xazoRy7KeHdN_HDkcJ85iI5NA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4udmVjdG9yc3RvY2suY29tL2kvNTAwcC8zMi80NS9uby1pbWFnZS1zeW1ib2wtbWlz/c2luZy1hdmFpbGFi/bGUtaWNvbi1nYWxs/ZXJ5LXZlY3Rvci00/NTcwMzI0NS5qcGc",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Product", ProductSchema);