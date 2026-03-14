import Product from "../models/Product.js";
import Category from "../models/Category.js";

const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    const text = String(q ?? "").trim();

    if (!text) {
      return res.status(400).json({
        ok: false,
        message: "Debe ingresar un término de búsqueda",
      });
    }

    const query = {
      active: true,
      $text: { $search: text },
    };

    const products = await Product.find(query)
      .populate("category", "name")
      .limit(20);

    res.json({
      total: products.length,
      results: products,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

const searchCategories = async (req, res) => {
  try {
    const { q } = req.query;

    const text = String(q ?? "").trim();

    if (!text) {
      return res.status(400).json({
        ok: false,
        message: "Debe ingresar un término de búsqueda",
      });
    }

    const categories = await Category.find({
      name: new RegExp(text, "i"),
      active: true,
    }).limit(20);

    res.json({
      total: categories.length,
      results: categories,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

const searchAll = async (req, res) => {
  try {
    const { q } = req.query;

    const text = String(q ?? "").trim();

    if (!text) {
      return res.status(400).json({
        ok: false,
        message: "Debe ingresar un término de búsqueda",
      });
    }

    const [products, categories] = await Promise.all([
      Product.find({
        active: true,
        $text: { $search: text },
      })
        .populate("category", "name")
        .limit(10),

      Category.find({
        name: new RegExp(text, "i"),
        active: true,
      }).limit(10),
    ]);

    res.json({
      products,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

export {
  searchProducts,
  searchCategories,
  searchAll,
};