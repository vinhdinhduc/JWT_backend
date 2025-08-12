import express from "express";

import userController from "../controller/userController.js";
import crudUserController from "../controller/crudUserController.js";
import groupController from "../controller/groupController.js";
import roleApiController from "../controller/roleApiController.js";
import { checkUserJWT, checkUserPermission } from "../middleware/jwtAction.js";
const router = express.Router();

const initApiRoutes = (app) => {
  router.post("/register", userController.registerUser);
  router.post("/login", userController.loginUser);
  router.get("/logout", userController.logOutUser);

  router.use("/users", checkUserJWT, checkUserPermission);
  router.get("/users/read", crudUserController.showUser);
  router.post("/users/create", crudUserController.createUser);
  router.put("/users/update", crudUserController.updateUser);
  router.delete("/users/delete", crudUserController.deleteUser);

  router.get("/roles/read", roleApiController.showRole);
  router.post("/roles/create", roleApiController.createRole);
  router.put("/roles/update", roleApiController.updateRole);
  router.delete("/roles/delete/:id", roleApiController.deleteRole);

  router.get("/account", checkUserJWT, crudUserController.getUserAccount);
  router.get("/users/group/read", groupController.getGroupFunc);
  router.get(
    "/users/get-role-by-group/:groupId",
    groupController.getRoleByGroup
  );
  return app.use("/api/v1", router);
};

export default initApiRoutes;
