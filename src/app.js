import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js"
import cookieParser from "cookie-parser";
import productsRouter from "./routes/products.routes.js";
import categoriesRouter from "./routes/categories.routes.js";
import ruteRegister from './rutes/ruteRegister.js'
import user from "./routes/user.routes.js"
import paymentRoutes from "./routes/payment.routes.js"

import fieldRoutes from "./routes/field.routes.js"


const app = express();

app.use(morgan("dev")); 
app.use(express.json()); 
app.use(express.urlencoded({extended: true})); 
app.use(cookieParser())
app.use(cors());


app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);
app.use('/api/auth', ruteRegister )
app.use("/api/auth",authRoutes)
app.use("/api/users",user)
app.use("/api/fields", fieldRoutes);
app.use("/api/payment", paymentRoutes)



app.get('/health', (req, res) => {
    res.status(200).json({ ok: true });
  });

export default app;
