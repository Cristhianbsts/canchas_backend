import express from "express";
import cors from "cors";
import morgan from "morgan";
import productsRouter from "./routes/products.routes.js";
import categoriesRouter from "./routes/categories.routes.js";
import ruteRegister from './rutes/ruteRegister.js'



const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);
app.use('/api/auth', ruteRegister )

app.get('/health', (req, res) => {
    res.status(200).json({ ok: true });
  });

export default app;
