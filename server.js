import express from "express";
import configViewEngine from "./src/config/viewEngine.js";
import initWebRoutes from "./src/routes/web.js";
import connectDB from "./src/config/connectDB.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();

const app = express();
//config body parse

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectDB();
initWebRoutes(app);
configViewEngine(app);

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running port: http://localhost:${PORT} `);
});
