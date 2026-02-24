//Controlador global de errores

const errorHandler = (err, req, res, next)=>{
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
        ok: false,
        message: err.message || "Fallo en la conexión al servidor"
    })
}

export {errorHandler}