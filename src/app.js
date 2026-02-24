import express from "express";
import morgan from "morgan";
import { errorHandler } from "./middlewares/error.middleware.js";
import {ApiError} from "./utils/apiError.js"



const app = express();

app.use(express.json()); 
app.use(express.urlencoded({extended: true})); 
app.use(morgan("dev")); 
app.use((req, res, next) => {
  next(new ApiError("Ruta no encontrada", 404));
});
app.use(errorHandler)

app.get('/health', (req, res) => {
  res.status(200).json({ ok: true });
});

app.use(errorHandler)

export default app;
