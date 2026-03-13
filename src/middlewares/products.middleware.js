import Product from "../models/Product.js";

// ----------------------------------------------------
// Validar si el producto existe por ID
// ----------------------------------------------------
const validateProductId = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    // Si no existe el producto
    if (!product) {
      return res.status(404).json({
        ok: false,
        message: "No existe el producto",
      });
    }

    // Si existe pero está inactivo (soft delete)
    if (product.active === false) {
      return res.status(404).json({
        ok: false,
        message: "El producto no está disponible",
      });
    }

    // Guardamos el producto en req por si después querés reutilizarlo
    req.product = product;

    next();
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

// ----------------------------------------------------
// FUTURO:
// Acá después podés agregar más middlewares de productos
// Ejemplo:
// - validateProductNameExists
// - validateCategoryExists
// - validateProductOwnership
// - validateProductCanBeDeleted
// ----------------------------------------------------

export {
  validateProductId,
};