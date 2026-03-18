const validarRolAdmin = (req, res, next) => {
  const rol = req.user.role;

  if (rol !== "admin") {
    return res.status(401).json({
      ok: false,
      message: "No tiene permisos para realizar esta accion ",
    });
  }
  next();
};
export { validarRolAdmin };
