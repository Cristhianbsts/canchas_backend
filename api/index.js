import app from "../src/app.js";
import { dbConnect } from "../src/config/db.js";


await dbConnect();


const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log("🚀 Servidor en línea en puerto: " + PORT));