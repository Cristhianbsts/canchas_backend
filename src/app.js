import express from "express";
import morgan from "morgan";
import { errorHandler } from "./middlewares/error.middleware.js";
import {ApiError} from "./utils/createError.js"



const app = express();

app.use(express.json()); 
app.use(express.urlencoded({extended: true})); 
app.use(morgan("dev")); 


app.get('/health', (req, res) => {
  res.status(200).json({ ok: true });
});
app.use((req, res, next) => {
  return res.status(404).json({
    ok: false,
    status: 404,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
})
app.use(errorHandler)

export default app;
