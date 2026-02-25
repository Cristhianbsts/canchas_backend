import express from "express";
import cors from "cors";
import morgan from "morgan";

import productsRouter from "./routes/products.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/products", productsRouter);

// test rapido
app.get("/", (req,res)=> res.send("API funcionando"));

export default app;