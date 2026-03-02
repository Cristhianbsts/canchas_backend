import { request, response } from "express";
import Product from "../models/Product.js";

// obtener la lista de productos
const getProducts = async (req, res) => {
  try {
    const { limit = 5, offset = 0 } = req.query;

    const parsedLimit = Number(limit);
    const parsedOffset = Number(offset);

    const query = { status: true };

    const [total, items] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query)
        .limit(parsedLimit)
        .skip(parsedOffset)
        .populate("user", "username email role")
        .populate("category", "name"),
    ]);

    res.json({ total, items });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

// crear un producto
const createProduct = async (req, res) => {
  try {
    const { price, stock, category, description, available, image } = req.body;

    // si usás validators, name ya viene validado, igual lo normalizamos
    const name = String(req.body.name).trim().toUpperCase();

    // validar si ya existe un producto con ese nombre (solo activos)
    const existingItem = await Product.findOne({ name, status: true });
    if (existingItem) {
      return res.status(400).json({
        ok: false,
        message: `El producto con el nombre ${existingItem.name} ya existe`,
      });
    }

    const data = {
      name,
      category,
      price,
      stock,
      description,
      available,
      image,
      user: req.user._id,
    };

    const item = await Product.create(data);

    res.status(201).json({
      ok: true,
      message: `El producto ${item.name} se guardó con éxito!!`,
      item,
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(400).json({
        ok: false,
        message: "Ya existe un producto con ese nombre",
      });
    }

    res.status(500).json({ ok: false, message: error.message });
  }
};

// actualizar un producto
const updateProduct = async (req = request, res = response) => {
  try {
    const { id } = req.params;

    const { price, stock, category, description, available, image } = req.body;

    const data = {
      user: req.user._id,
    };

    if (price !== undefined) data.price = price;
    if (stock !== undefined) data.stock = stock;
    if (category !== undefined) data.category = category;
    if (description !== undefined) data.description = description;
    if (available !== undefined) data.available = available;
    if (image !== undefined) data.image = image;

    if (req.body.name) {
      data.name = String(req.body.name).trim().toUpperCase();
    }

    // validar nombre solo si se está actualizando (evitar duplicados excluyendo el mismo id)
    if (data.name) {
      const existingItem = await Product.findOne({
        name: data.name,
        status: true,
        _id: { $ne: id },
      });

      if (existingItem) {
        return res.status(400).json({
          ok: false,
          message: "Ya existe un producto con ese nombre",
        });
      }
    }

    const updatedItem = await Product.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true, // clave para que min/required del schema se apliquen en updates
    });

    if (!updatedItem || updatedItem.status === false) {
      return res.status(404).json({
        ok: false,
        message: "No existe el producto",
      });
    }

    res.status(200).json({
      ok: true,
      message: "Producto actualizado!",
      item: updatedItem,
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(400).json({
        ok: false,
        message: "Ya existe un producto con ese nombre",
      });
    }

    res.status(500).json({ ok: false, message: error.message });
  }
};

// borrar un producto
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedItem = await Product.findByIdAndUpdate(
      id,
      { status: false },
      { new: true }
    );

    if (!deletedItem) {
      return res.status(404).json({
        ok: false,
        message: "No existe el producto",
      });
    }

    res.status(200).json({
      ok: true,
      message: "Producto eliminado",
      item: deletedItem,
    });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

export { createProduct, getProducts, updateProduct, deleteProduct };