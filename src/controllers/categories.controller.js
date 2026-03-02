import Category from "../models/Category.js";

// Traer categorías activas
const getCategories = async (req, res) => {
  try {
    const query = { status: true };

    const [total, categories] = await Promise.all([
      Category.countDocuments(query),
      Category.find(query).populate("user", "username email role"),
    ]);

    res.json({
      total,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

// Crear categoría
const createCategory = async (req, res) => {
  try {
    const name = String(req.body.name || "").trim().toUpperCase();

    if (!name) {
      return res.status(400).json({
        ok: false,
        message: "El nombre es obligatorio",
      });
    }

    const existingCategory = await Category.findOne({
      name,
      status: true,
    });

    if (existingCategory) {
      return res.status(400).json({
        ok: false,
        message: `La categoría ${name} ya existe`,
      });
    }

    const category = await Category.create({
      name,
      user: req.user._id,
    });

    res.status(201).json({
      message: "Categoría guardada",
      category,
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(400).json({
        ok: false,
        message: "Ya existe una categoría con ese nombre",
      });
    }

    res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

// Actualizar categoría
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const name = String(req.body.name || "").trim().toUpperCase();

    const existingCategory = await Category.findOne({
      name,
      status: true,
      _id: { $ne: id },
    });

    if (existingCategory) {
      return res.status(400).json({
        ok: false,
        message: "Ya existe una categoría con ese nombre",
      });
    }

    const data = {
      name,
      user: req.user._id,
    };

    const category = await Category.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return res.status(404).json({
        ok: false,
        message: "Categoría no encontrada",
      });
    }

    res.status(200).json({
      message: "Categoría actualizada",
      category,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

// borrar categoría (soft delete)
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCategory = await Category.findByIdAndUpdate(
      id,
      { status: false },
      { new: true }
    );

    if (!deletedCategory) {
      return res.status(404).json({
        ok: false,
        message: "Categoría no encontrada",
      });
    }

    res.status(200).json({
      message: "Categoria eliminada",
      deletedCategory,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

export {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};