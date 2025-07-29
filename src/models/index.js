 
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import dotenv from "dotenv";
import Sequelize from "sequelize";
import process from "process";

 
import configData from "../config/config.json" with { type: "json" };
 

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";

const config = configData[env];

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

const loadModels = async () => {
  const files = fs.readdirSync(__dirname).filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  });

  for (const file of files) {
    // Chuyển đổi đường dẫn của từng model thành URL trước khi import
    const modelPath = path.join(__dirname, file);
    const modelUrl = pathToFileURL(modelPath).href;
    const modelModule = await import(modelUrl);
    
    const model = modelModule.default(sequelize, Sequelize.DataTypes);
    
    db[model.name] = model;
  }

  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  return db;
};

export default await loadModels();