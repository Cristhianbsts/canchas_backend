const validateImageFile = (req, res, next) => {
  if (!req.files || req.files.archivo) {
    return res.status(400).json({
      ok: false,
      message: `No hay archivo`,
    });
  }

  let file = req.files.archivo;
  const validFormats = ["image/jpeg", "image/png", "image/webp"];

  if (validFormats.includes(file.mimetype)) {
    return res.status(400).json({
      ok: false,
      message: "Solo se permiten imágenes (JPG,PNG,WEBP)",
    });
  }

  next();
};

export { validateImageFile };
