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

    if (!category || category.active === false) {
      return res.status(404).json({
        ok: false,
        message: "Categoría no encontrada",
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

    const category = await Category.findOne({ name, active: true });

    if (category) {
      return res.status(400).json({
        ok: false,
        message: "Ya existe una categoría con ese nombre",
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

const validateCategoryNameOnUpdate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const name = normalizeName(req.body.name);

    if (!name) return next();

    const category = await Category.findOne({
      name,
      active: true,
      _id: { $ne: id },
    });

    if (category) {
      return res.status(400).json({
        ok: false,
        message: "Ya existe una categoría con ese nombre",
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