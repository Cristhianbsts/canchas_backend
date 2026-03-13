import Category from "../models/Category.js";

const getCategories = async (req, res) => {
  try {
    const query = { active: true };

    const [total, categories] = await Promise.all([
      Category.countDocuments(query),
      Category.find(query),
    ]);

    res.json({
      ok: true,
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

const createCategory = async (req, res) => {
  try {
    const name = String(req.body.name ?? "").trim();

    const category = await Category.create({
      name,
      slug: name,
    });

    res.status(201).json({
      ok: true,
      message: "Categoría creada",
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

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const name = String(req.body.name ?? "").trim();

    const data = {
      name,
      slug: name,
    };

    const category = await Category.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!category || category.active === false) {
      return res.status(404).json({
        ok: false,
        message: "Categoría no encontrada",
      });
    }

    res.json({
      ok: true,
      message: "Categoría actualizada",
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

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndUpdate(
      id,
      { active: false },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({
        ok: false,
        message: "Categoría no encontrada",
      });
    }

    res.json({
      ok: true,
      message: "Categoría eliminada",
      category,
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