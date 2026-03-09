import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js";

cloudinary.config(process.env.CLOUDINARY_URL);

const updateImageProduct = async (req, res) => {
  try {
    const { id } = req.params;

    let product = await Product.findById(id);

    if (!product) {
      return res.status(400).json({
        ok: false,
        message: `No existe un producto con el id: ${id}`,
      });
    }

    let file = req.files.archivo;

    if (!file.data) {
      return res.status(400).json({
        ok: false,
        message: "Error en buffer",
      });
    }

    const dataUri = `data:${file.mimetype};base64,${file.data.toString("base64")}`;

    const result = await cloudinary.uploader.upload(dataUri);

    product.image = result.secure_url;
    product.save();

    res.status(200).json({
      ok: true,
      message: "Imagen actualizada",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export { updateImageProduct };
