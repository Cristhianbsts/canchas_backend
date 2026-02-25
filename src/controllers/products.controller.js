import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";
import createError from "../utils/createError.js";
import { ok } from "../utils/apiResponse.js";


export const getProducts = asyncHandler(async (req, res) => {
  const { q, category, minPrice, maxPrice } = req.query;

  const filter = { active: true };

  if (category) {
    filter.category = String(category).trim().toLowerCase().replace(/\s+/g, " ");
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
    if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
  }

  if (q) {
    // usa el índice text si existe, si no, igual funciona
    filter.$text = { $search: q };
  }

  const products = await Product.find(filter).sort({ createdAt: -1 });

  return ok(res, products, "Productos obtenidos");
});


export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findOne({ _id: id, active: true });
  if (!product) throw createError(404, "Producto no encontrado");

  return ok(res, product, "Producto obtenido");
});


export const createProduct = asyncHandler(async (req, res) => {
  // 1) Normalizamos igual que el model (para comparar bien)
  const name = String(req.body.name ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

  const category = String(req.body.category ?? "general")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

  // 2) Chequeo previo (mensaje lindo)
  const exists = await Product.findOne({ name, category, active: true });
  if (exists) throw createError(400, "Ya existe un producto con ese nombre en esa categoría");

  // 3) Creamos (guardamos normalizado)
  try {
    const product = await Product.create({ ...req.body, name, category });

    return res.status(201).json({
      ok: true,
      message: "Producto creado",
      data: product,
    });
  } catch (error) {
    // 4) Protección REAL (índice unique). Esto cubre concurrencia.
    if (error?.code === 11000) {
      throw createError(400, "Ya existe un producto con ese nombre en esa categoría");
    }
    throw error;
  }
});


export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const updated = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updated) throw createError(404, "Producto no encontrado");

  return ok(res, updated, "Producto actualizado");
});


export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) throw createError(404, "Producto no encontrado");

  product.active = false;
  await product.save();

  return ok(res, product, "Producto desactivado");
});


export const adminGetAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  return ok(res, products, "Productos (admin) obtenidos");
});