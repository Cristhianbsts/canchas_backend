import Category from "../models/Category.js";

const normalizeName = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const validateCategoryId = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        ok: false,
        message: "Categoria no encontrada",
      });
    }

    req.category = category;
    next();
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

const validateCategoryNameExists = async (req, res, next) => {
  try {
    const name = normalizeName(req.body.name);

    if (!name) return next();

    const category = await Category.findOne({ name });

    if (category && category.active !== false) {
      return res.status(400).json({
        ok: false,
        message: "Ya existe una categoria con ese nombre",
      });
    }

    if (category) {
      req.categoryToReactivate = category;
    }

    next();
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

const validateCategoryNameOnUpdate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const name = normalizeName(req.body.name);

    if (!name) return next();

    const category = await Category.findOne({
      name,
      _id: { $ne: id },
    });

    if (category) {
      return res.status(400).json({
        ok: false,
        message: "Ya existe una categoria con ese nombre",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

export {
  validateCategoryId,
  validateCategoryNameExists,
  validateCategoryNameOnUpdate,
};
