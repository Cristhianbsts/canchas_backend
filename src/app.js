import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import nodemailerRouter from "./routes/nodemailer.routes.js"

import registerRouter from "./routes/register.routes.js";
import loginRouter from "./routes/login.routes.js";
import userRouter from "./routes/user.routes.js";

import fieldRoutes from "./routes/field.routes.js";
import categoryRoutes from "./routes/categories.routes.js";
import productRoutes from "./routes/products.routes.js";
import searchRoutes from "./routes/search.routes.js";

const app = express();

app.use(morgan("dev")); 
app.use(express.json()); 
app.use(express.urlencoded({extended: true})); 
app.use(cookieParser())
app.use(cors({
  origin: "http://localhost:5173"
}));

app.use("/api/register", registerRouter);
app.use("/api/login", loginRouter);
app.use("/api/users", userRouter);

app.use("/api/fields", fieldRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/search", searchRoutes);
app.use('/api/auth', registerRouter )
app.use("/api/auth", loginRouter)
app.use("/api/contact", nodemailerRouter)



app.get("/index", (req, res) => {
  res.status(200).json({ ok: true });
});

export default app;