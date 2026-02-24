import express from "express";
import morgan from "morgan";
import { errorHandler } from "./middlewares/errorHandler.js";



const app = express();

app.use(express.json()); 
app.use(express.urlencoded({extended: true})); 
app.use(morgan("dev")); 

app.use(errorHandler)

app.get('/health', (req, res) => {
  res.status(200).json({ ok: true });
});

app.use(errorHandler)

export default app;
