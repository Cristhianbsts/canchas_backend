import express from "express";
import cors from "cors";
import morgan from "morgan";
<<<<<<< HEAD
import loginRouter from "./routes/login.routes.js"
import cookieParser from "cookie-parser";
import registerRouter from './routes/register.routes.js'
import user from "./routes/user.routes.js"
=======
import authRoutes from "./routes/auth.routes.js"
//import cookieParser from "cookie-parser.js";
import productsRouter from "./routes/products.routes.js";
import categoriesRouter from "./routes/categories.routes.js";
import ruteRegister from './rutes/ruteRegister.js'
import routeBooking from "../src/rutes/routeBooking.js"
>>>>>>> test/book

import fieldRoutes from "./routes/field.routes.js"


const app = express();

app.use(morgan("dev")); 
app.use(express.json()); 
app.use(express.urlencoded({extended: true})); 
//app.use(cookieParser())
app.use(cors());

<<<<<<< HEAD

app.use('/api/register', registerRouter )
app.use("/api/login",loginRouter)
app.use("/api/users",user)
app.use("/api/fields", fieldRoutes);
=======
app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);
app.use('/api/auth', ruteRegister )
app.use("/api/auth",authRoutes)
app.use("/api/findbook",routeBooking)

>>>>>>> test/book



app.get('/index', (req, res) => {
    res.status(200).json({ ok: true });
  });

export default app;
