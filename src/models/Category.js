import mongoose from "mongoose";

const normalize = (v) =>
  String(v ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const slugify = (v) =>
  normalize(v)
    .replace(/[^\w\s-]/g, "") // quita caracteres raros
    .replace(/\s+/g, "-");    // espacios a guiones

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
      maxlength: [40, "El nombre no puede superar 40 caracteres"],
      set: normalize,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      set: slugify,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, autoIndex: true }
);

// Evita duplicados por nombre SOLO en activas
categorySchema.index(
  { name: 1 },
  { unique: true, partialFilterExpression: { active: true } }
);

const Category = mongoose.model("Category", categorySchema);
export default Category;