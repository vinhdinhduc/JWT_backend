import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Dùng để lấy __dirname vì đang dùng ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configViewEngine = (app) => {
  //
  app.set("views", path.join(__dirname, "../views"));

  app.set("view engine", "ejs");

  // Cấu hình thư mục chứa các file tĩnh như CSS, JS, hình ảnh
  app.use(express.static(path.join(__dirname, "../../public")));
};

export default configViewEngine;
