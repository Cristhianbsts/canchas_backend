import { check, validationResult } from "express-validator";
import User from "../models/User.js";

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      errors: errors.mapped(),
    });
  }
  next();
};

const validateLoginUser = () => [
  check("email")
    .notEmpty()
    .withMessage("El campo es obligatorio")
    .isEmail()
    .withMessage("Ingresá un correo electrónico válido.")
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user?.emailVerified) {
        throw new Error("El usuario ya está verificado");
      }
    }),

  check("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isString()
    .withMessage("El campo tiene que ser un string"),

  handleValidationErrors,
];

export { validateLoginUser };
