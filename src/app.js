import express from "express";
import morgan from "morgan";
import ruteRegister from './rutes/ruteRegister.js'



const app = express();

app.use(express.json()); 
app.use(express.urlencoded({extended: true})); 
app.use(morgan("dev")); 


app.use('/api/auth', ruteRegister )

export default app;
