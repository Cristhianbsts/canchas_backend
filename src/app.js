import express from "express";
import cors from "cors";
import morgan from "morgan";
import fileUpload from "express-fileupload";

import productsRouter from "./routes/products.routes.js";
import categoriesRouter from "./routes/categories.routes.js";
import cartRouter from "./routes/cart.routes.js";
import searchRouter from "./routes/search.routes.js";
import uploadRouter from "./routes/upload.routes.js";

import authRouter from "./rutes/ruteRegister.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Necesario para Cloudinary upload (req.files)
app.use(
  fileUpload({
    useTempFiles: false,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    abortOnLimit: true,
  })
);

// Routes
app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/cart", cartRouter);
app.use("/api/search", searchRouter);
app.use("/api/upload", uploadRouter);

app.use("/api/auth", authRouter);

app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});

export default app;