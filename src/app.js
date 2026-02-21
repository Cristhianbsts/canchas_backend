import express from "express";
import morgan from "morgan";



const app = express();

app.use(express.json()); 
app.use(express.urlencoded({extended: true})); 
app.use(morgan("dev")); 


app.get('/health', (req, res) => {
  res.status(200).json({ ok: true });
});

export default app;
