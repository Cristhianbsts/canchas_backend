import express from "express";
import cors from "cors";
import morgan from "morgan";
import loginRouter from "./routes/login.routes.js"
import cookieParser from "cookie-parser";
import registerRouter from './routes/register.routes.js'
import user from "./routes/user.routes.js"
import routeBooking from "./routes/routeBooking.js"

import fieldRoutes from "./routes/field.routes.js"


const app = express();

app.use(morgan("dev")); 
app.use(express.json()); 
app.use(express.urlencoded({extended: true})); 
//app.use(cookieParser())
app.use(cors());


app.use('/api/register', registerRouter );
app.use("/api/login",loginRouter);
app.use("/api/users",user);
app.use("/api/fields", fieldRoutes);
app.use("/api/book",routeBooking);



app.get('/index', (req, res) => {
    res.status(200).json({ ok: true });
  });

export default app;
