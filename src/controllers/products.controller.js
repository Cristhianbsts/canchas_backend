import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js";

const DEFAULT_IMAGE =
  "https://res.cloudinary.com/dp7qbi976/image/upload/v1733325605/v7fiv6xngp8o78v7a3sd.webp";

const normalizeProductName = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

const parseBoolean = (value, fallback = undefined) => {
  if (value === undefined) return fallback;
  if (typeof value === "boolean") return value;

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (normalized === "true") return true;
    if (normalized === "false") return false;
  }

  return Boolean(value);
};

const uploadProductImage = async (file) => {
  if (!file) return null;

  const dataUri = `data:${file.mimetype};base64,${file.data.toString("base64")}`;
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: "productos",
  });

  return result.secure_url;
};

const getProducts = async (req, res) => {
  try {
    const { limit = 5, offset = 0 } = req.query;

    const parsedLimit = Number(limit);
    const parsedOffset = Number(offset);
    const query = { active: true };

    const [total, items] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query)
        .limit(parsedLimit)
        .skip(parsedOffset)
        .populate("category", "name"),
    ]);

    res.json({ total, items });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

const getAdminProducts = async (req, res) => {
  try {
    const [total, items] = await Promise.all([
      Product.countDocuments(),
      Product.find({})
        .sort({ active: -1, name: 1 })
        .populate("category", "name"),
    ]);

    res.json({
      ok: true,
      total,
      items,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const { price, stock, category, description } = req.body;
    const name = normalizeProductName(req.body.name);
    const imageUrl = await uploadProductImage(req.files?.archivo);

    const existingItem = await Product.findOne({
      name,
      category,
      active: true,
    });

    if (existingItem) {
      return res.status(400).json({
        ok: false,
        message: `El producto ${name} ya existe`,
      });
    }

    const inactiveItem = await Product.findOne({
      name,
      category,
      active: false,
    });

    if (inactiveItem) {
      inactiveItem.name = name;
      inactiveItem.category = category;
      inactiveItem.price = price;
      inactiveItem.stock = stock;
      inactiveItem.description = description;
      inactiveItem.active = true;
      inactiveItem.image = imageUrl || inactiveItem.image || DEFAULT_IMAGE;

      await inactiveItem.save();

      return res.json({
        ok: true,
        message: `Producto ${inactiveItem.name} reactivado`,
        item: inactiveItem,
      });
    }

    const data = {
      name,
      category,
      price,
      stock,
      description,
      active: parseBoolean(req.body.active, true),
      image: imageUrl || DEFAULT_IMAGE,
      user: req.user._id,
    };

    const item = await Product.create(data);

    res.status(201).json({
      ok: true,
      message: `Producto ${item.name} creado`,
      item,
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(400).json({
        ok: false,
        message: "Ya existe un producto con ese nombre",
      });
    }

    res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = req.product;
    const { price, stock, category, description } = req.body;

    const nextName =
      req.body.name !== undefined ? normalizeProductName(req.body.name) : product.name;
    const nextCategory = category !== undefined ? category : product.category;
    const nextActive = parseBoolean(req.body.active, product.active);

    if (nextActive) {
      const existingItem = await Product.findOne({
        name: nextName,
        category: nextCategory,
        active: true,
        _id: { $ne: product._id },
      });

      if (existingItem) {
        return res.status(400).json({
          ok: false,
          message: "Ya existe un producto con ese nombre",
        });
      }
    }

    if (req.body.name !== undefined) product.name = nextName;
    if (price !== undefined) product.price = price;
    if (stock !== undefined) product.stock = stock;
    if (category !== undefined) product.category = category;
    if (description !== undefined) product.description = description;
    if (req.body.active !== undefined) product.active = nextActive;

    const imageUrl = await uploadProductImage(req.files?.archivo);

    if (imageUrl) {
      product.image = imageUrl;
    }

    await product.save();

    res.json({
      ok: true,
      message: "Producto actualizado",
      item: product,
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(400).json({
        ok: false,
        message: "Ya existe un producto con ese nombre",
      });
    }

    res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

const activateProduct = async (req, res) => {
  try {
    const product = req.product;

    const existingItem = await Product.findOne({
      name: product.name,
      category: product.category,
      active: true,
      _id: { $ne: product._id },
    });

    if (existingItem) {
      return res.status(400).json({
        ok: false,
        message: "Ya existe un producto activo con ese nombre",
      });
    }

    product.active = true;
    await product.save();

    res.json({
      ok: true,
      message: "Producto activado",
      item: product,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = req.product;

    product.active = false;
    await product.save();

    res.json({
      ok: true,
      message: "Producto desactivado",
      item: product,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

export {
  createProduct,
  getProducts,
  getAdminProducts,
  updateProduct,
  activateProduct,
  deleteProduct,
};
