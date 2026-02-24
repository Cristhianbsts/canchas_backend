import express from "express";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js"



const app = express();

app.use(express.json()); 
app.use(express.urlencoded({extended: true})); 
app.use(morgan("dev")); 


//Rutas
app.use("/api/auth",authRoutes)

app.get('/health', (req, res) => {
  res.status(200).json({ ok: true });
});

export default app;
