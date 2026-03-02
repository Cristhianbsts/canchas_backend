import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js";

cloudinary.config(process.env.CLOUDINARY_URL);

const updateProductImage = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        ok: false,
        message: `No existe un producto con el id ${id}`,
      });
    }

    if (!req.files || !req.files.file) {
      return res.status(400).json({
        ok: false,
        message: "No hay archivo",
      });
    }

    const file = req.files.file;

    if (!file.data) {
      return res.status(400).json({
        ok: false,
        message: "Error en buffer",
      });
    }

    const dataUri = `data:${file.mimetype};base64,${file.data.toString("base64")}`;

    const result = await cloudinary.uploader.upload(dataUri);

    // si tu modelo usa "image"
    product.image = result.secure_url;

    // si todavía usa "img"
    // product.img = result.secure_url;

    await product.save();

    res.status(200).json({
      ok: true,
      message: "Imagen actualizada",
      image: result.secure_url,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

export { updateProductImage };