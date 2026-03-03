import { check } from "express-validator";
import { handleValidationErrors } from "./error.middleware.js";
import User from "../models/User.js"

const validateLoginUser = () => [
  check("email")
    .notEmpty()
    .withMessage("El campo es obligatorio")
    .isEmail()
    .withMessage("Ingresá un correo electrónico válido."),
   

  check("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isString()
    .withMessage("El campo tiene que ser un string"),

  handleValidationErrors,
];

 const userExistsById = async (id) => {
  const user = await User.findById(id);

  if (!user) {
    throw new Error("Usuario no existe");
  }
};

export { validateLoginUser ,userExistsById};
