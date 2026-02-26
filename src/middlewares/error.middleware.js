import mongoose from "mongoose";
import { ApiError } from "../utils/createError";

const errorHandler = (err, req, res, next) => {

    if (res.headersSent) {
        return next(err);
    }

    console.error(err.stack);

    if (err instanceof ApiError) {
        return res.status(err.statusCode || 500).json({
            ok: false,
            status: err.statusCode || 500,
            message: err.message
        });
    }

    let status = err.statusCode || err.status || 500;
    let message = err.message || "Error interno del servidor";
    let details;

    if (err.name === "CastError") {
        status = 400;
        message = `ID inválido en el campo "${err.path}"`;
        details = { value: err.value };
    }

    if (err instanceof mongoose.Error.ValidationError) {
        status = 400;
        message = "Error de validación";
        details = Object.values(err.errors).map(e => ({
            field: e.path,
            message: e.message
        }));
    }

    if (err.code === 11000) {
        status = 400;
        const fields = Object.keys(err.keyValue || {});
        message = `Registro duplicado: ${fields.join(", ")}`;
        details = err.keyValue;
    }

    if (err.name === "JsonWebTokenError") {
        status = 401;
        message = "Token inválido";
    }

    if (err.name === "TokenExpiredError") {
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

export { errorHandler };