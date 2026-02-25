import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
      maxlength: [80, "El nombre no puede superar 80 caracteres"],
      lowercase: true, 
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "La descripción no puede superar 500 caracteres"],
      default: "",
    },
    price: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      min: [0, "El precio no puede ser negativo"],
    },
    stock: {
      type: Number,
      required: [true, "El stock es obligatorio"],
      min: [0, "El stock no puede ser negativo"],
      default: 0,
    },
    category: {
      type: String,
      trim: true,
      maxlength: [40, "La categoría no puede superar 40 caracteres"],
      default: "General",
      lowercase: true,
    },
    image: {
      type: String,
      trim: true,
      default: "",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, autoIndex: true }
);


productSchema.index(
  { name: 1, category: 1 },
  {
    unique: true,
    partialFilterExpression: { active: true },
  }
);


productSchema.index({ name: "text", category: "text" });

const Product = mongoose.model("Product", productSchema);
export default Product;