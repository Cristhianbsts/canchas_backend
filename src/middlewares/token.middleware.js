import User from "../models/User.js";

export const authenticate = async (req, res, next) => {
  try {

    //revisar esta parte si es que va 
    const token = res.cookies.token;

    if (!token) {
      return res.status(401).json({
        ok: false,
        message: "La authenticación es requerida. Por favor envia un token",
      });
    }

    const decoded = virifyToken(token);

    const user = await User.findById(decoded.userId).select("--password");

    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "Usuario no encontrdo",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      ok: false,
      message: "Token invalido o ya expirado",
    });
  }
};
