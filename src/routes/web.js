import express from "express";

import homeController from "../controller/homeController.js";
const router = express.Router();

const initWebRoutes = (app) => {
  router.get("/", (req, res) => {
    return res.render("user.ejs");
  });

  router.post("/api/create-users", homeController.createNewUser);
  return app.use("/", router);
};

export default initWebRoutes;
