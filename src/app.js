import express from "express";
import cors from "cors";
import morgan from "morgan";
import productsRouter from "./routes/products.routes.js";
import categoriesRouter from "./routes/categories.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);

app.get('/health', (req, res) => {
    res.status(200).json({ ok: true });
  });

export default app;