import Product from "../models/Product.js";
import Category from "../models/Category.js";

const validateSearchQuery = (req, res, next) => {
  const { q } = req.query;

  const text = String(q ?? "").trim();

  if (!text) {
    return res.status(400).json({
      ok: false,
      message: "Debe ingresar un término de búsqueda",
    });
  }

  req.searchText = text;
  next();
};

const validateSearchCollection = (req, res, next) => {
  const { collection } = req.params;

  const allowedCollections = ["products", "categories"];

  if (!allowedCollections.includes(collection)) {
    return res.status(400).json({
      ok: false,
      message: "Colección de búsqueda no permitida",
    });
  }

  next();
};

export {
  validateSearchQuery,
  validateSearchCollection,
};