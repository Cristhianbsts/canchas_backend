import Category from "../models/Category.js";
import asyncHandler from "../utils/asyncHandler.js";
import createError from "../utils/createError.js";
import { ok } from "../utils/apiResponse.js";

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ active: true }).sort({ name: 1 });
  return ok(res, categories, "Categorías obtenidas");
});

export const getCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await Category.findOne({ _id: id, active: true });
  if (!category) throw createError(404, "Categoría no encontrada");
  return ok(res, category, "Categoría obtenida");
});

export const createCategory = asyncHandler(async (req, res) => {
  try {
    const created = await Category.create(req.body);
    return res.status(201).json({ ok: true, message: "Categoría creada", data: created });
  } catch (error) {
    if (error?.code === 11000) {
      throw createError(400, "Ya existe una categoría con ese nombre/slug");
    }
    throw error;
  }
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const updated = await Category.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updated) throw createError(404, "Categoría no encontrada");
  return ok(res, updated, "Categoría actualizada");
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id);
  if (!category) throw createError(404, "Categoría no encontrada");

  category.active = false;
  await category.save();

  return ok(res, category, "Categoría desactivada");
});

export const adminGetAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  return ok(res, categories, "Categorías (admin) obtenidas");
});