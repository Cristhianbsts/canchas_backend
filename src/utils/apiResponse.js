// src/utils/apiResponse.js
// Respuestas estándar para toda la API

export const ok = (res, data = null, message = "OK", status = 200) => {
    return res.status(status).json({
      ok: true,
      message,
      data,
    });
  };
  
  export const fail = (res, status = 400, message = "Error", details = null) => {
    return res.status(status).json({
      ok: false,
      message,
      details,
    });
  };