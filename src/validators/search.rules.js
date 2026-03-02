import mongoose from "mongoose";
import Producto from "../models/Product.js";

const { ObjectId } = mongoose.Types;

const buscarProductos = async (req, res) => {
  const { termino } = req.params;

  const esMongoId = ObjectId.isValid(termino);

  //buscar por id de producto
  if (esMongoId) {
    const producto = await Producto.findById(termino).populate(
      "categoria",
      "nombre",
    );

    return res.status(200).json({
      results: producto ? [producto] : [],
    });
  }

  //buscar nombre de producto por término

  const regex = new RegExp(termino, "i");

  const productos = await Producto.find({
    nombre: regex,
    estado: true,
  }).populate("categoria", "nombre");

  const total = await Producto.countDocuments({
    nombre: regex,
    estado: true,
  });

  res.status(200).json({
    total,
    results: productos,
  });
};

export { buscarProductos };