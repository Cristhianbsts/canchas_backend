import Category from "../models/Category.js";

const normalizeName = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const getCategories = async (req, res) => {
  try {
    const query = { active: true };

    const [total, categories] = await Promise.all([
      Category.countDocuments(query),
      Category.find(query).sort({ name: 1 }),
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
    const name = normalizeName(req.body.name);
    const categoryToReactivate =
      req.categoryToReactivate || (await Category.findOne({ name }));

    if (categoryToReactivate) {
      categoryToReactivate.name = name;
      categoryToReactivate.slug = name;
      categoryToReactivate.active = true;

      await categoryToReactivate.save();

      return res.json({
        ok: true,
        message: "Categoria reactivada",
        category: categoryToReactivate,
      });
    }

    const category = await Category.create({
      name,
      slug: name,
    });

    res.status(201).json({
      ok: true,
      message: "Categoria creada",
      category,
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(400).json({
        ok: false,
        message: "Ya existe una categoria con ese nombre",
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
    const category = req.category;

    if (req.body.name !== undefined) {
      const name = normalizeName(req.body.name);
      category.name = name;
      category.slug = name;
    }

    await category.save();

    res.json({
      ok: true,
      message: "Categoria actualizada",
      category,
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(400).json({
        ok: false,
        message: "Ya existe una categoria con ese nombre",
      });
    }

    res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

const activateCategory = async (req, res) => {
  try {
    const category = req.category;

    category.active = true;
    await category.save();

    res.json({
      ok: true,
      message: "Categoria activada",
      category,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = req.category;

    category.active = false;
    await category.save();

    res.json({
      ok: true,
      message: "Categoria desactivada",
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
  activateCategory,
  deleteCategory,
};
