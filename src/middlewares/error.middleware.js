import mongoose from "mongoose";
import { validationResult } from "express-validator";

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  console.error(err.stack || err);

  let status = err.statusCode || err.status || 500;
  let message = err.message || "Error interno del servidor";
  let details;

  if (err.statusCode || err.status) {
    return res.status(status).json({
      ok: false,
      status,
      message,
      ...(err.details && { details: err.details }),
    });
  }


  if (err.name === "CastError") {
    status = 400;
    message = `ID inválido en el campo "${err.path}"`;
    details = { value: err.value };
  }

  else if (err instanceof mongoose.Error.ValidationError) {
    status = 400;
    message = "Error de validación";
    details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  else if (err.code === 11000) {
    status = 400;
    const fields = Object.keys(err.keyValue || {});
    message = `Registro duplicado: ${fields.join(", ")}`;
    details = err.keyValue;
  }


  else if (err.name === "JsonWebTokenError") {
    status = 401;
    message = "Token inválido";
  }


  else if (err.name === "TokenExpiredError") {
    status = 401;
    message = "Token expirado";
  }

  return res.status(status).json({
    ok: false,
    status,
    message,
    ...(details && { details }),
  });
};

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      status: 400,
      message: "Errores de validación",
      errors: errors.mapped(),
    });
  }

  next();
};
export {handleValidationErrors, errorHandler}

