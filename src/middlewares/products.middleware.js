import Product from "../models/Product.js";


const validateProductId = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);


    if (!product) {
      return res.status(404).json({
        ok: false,
        message: "No existe el producto",
      });
    }


    req.product = product;


    if (product.active === false) {
      req.productDeleted = true; 
    }

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