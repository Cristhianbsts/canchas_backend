import mongoose from "mongoose";
import Product from "../models/Product.js";

const { ObjectId } = mongoose.Types;

const searchProducts = async (req, res) => {
  const { term } = req.params;
  const { limit = 10, offset = 0 } = req.query;

  const parsedLimit = Number(limit);
  const parsedOffset = Number(offset);

  const isMongoId = ObjectId.isValid(term);

  // search by product id
  if (isMongoId) {
    const item = await Product.findById(term).populate("category", "name");

    return res.status(200).json({
      total: item && item.status !== false ? 1 : 0,
      results: item && item.status !== false ? [item] : [],
    });
  }

  // search by product name
  const regex = new RegExp(term, "i");
  const query = { name: regex, status: true };

  const [total, results] = await Promise.all([
    Product.countDocuments(query),
    Product.find(query)
      .populate("category", "name")
      .limit(parsedLimit)
      .skip(parsedOffset),
  ]);

  return res.status(200).json({
    total,
    results,
  });
};

const search = async (req, res) => {
  const { collection } = req.params;

  if (collection === "products") {
    return searchProducts(req, res);
  }

  return res.status(400).json({
    ok: false,
    message: "Colección no permitida",
  });
};

export { search };