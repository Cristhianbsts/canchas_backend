// src/utils/createError.js
// Crea errores con status HTTP para usar con "throw createError(...)"

const createError = (status = 500, message = "Error interno", details = null) => {
    const err = new Error(message);
    err.status = status;
    if (details !== null) err.details = details;
    return err;
  };
  
  export default createError;