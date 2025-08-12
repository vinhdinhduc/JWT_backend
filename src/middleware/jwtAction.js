import { log } from "console";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

const nonSecurePaths = ["/", "/login", "/logout", "/register"];
const createJWT = (payload) => {
  let key = process.env.JWT_SECRET;

  let token = null;

  try {
    token = jwt.sign(payload, key, { expiresIn: process.env.JWT_EXPIRES_IN });
  } catch (error) {
    console.log(error);
  }
  return token;
};

const verifyToken = (token) => {
  let key = process.env.JWT_SECRET;
  let decoded = null;

  try {
    decoded = jwt.verify(token, key);
  } catch (error) {
    console.log(error);
  }
  return decoded;
};
const extractTokenFromHeader = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
};
const checkUserJWT = (req, res, next) => {
  if (nonSecurePaths.includes(req.path)) return next();

  let cookies = req.cookies;
  let tokenFromHeader = extractTokenFromHeader(req);
  if ((cookies && cookies.jwt) || tokenFromHeader) {
    let token = cookies && cookies.jwt ? cookies.jwt : tokenFromHeader;

    let decoded = verifyToken(token);

    if (decoded) {
      req.user = decoded;

      req.token = token;

      next();
    } else {
      return res.status(401).json({
        errCode: -1,
        errMessage: "No authenticated the user",
        data: "",
      });
    }
  } else {
    return res.status(401).json({
      errCode: -1,
      errMessage: "No authenticated the user",
      data: "",
    });
  }
};

const checkUserPermission = (req, res, next) => {
  if (nonSecurePaths.includes(req.path) || req.path === "/api/v1/account")
    return next();
  if (req.user) {
    let email = req.user.email;
    let roles = req.user.groupWithRoles.Roles;
    let currentUrl = req.originalUrl.replace("/api/v1", "").split("?")[0];
    console.log(
      `Checking permissions for user: ${email} on URL: ${currentUrl}`
    );
    console.log(req.path);

    if (!roles || roles.length === 0) {
      return res.status(403).json({
        errCode: -1,
        errMessage: "You don't permission to access this resource",
        data: "",
      });
    }

    let canAccess = roles.some((item) => {
      console.log(
        `Checking role: ${item.url} against current URL: ${currentUrl}`
      );
      return item.url === currentUrl;
    });
    if (canAccess) {
      next();
    } else {
      return res.status(403).json({
        errCode: -1,
        errMessage: "You don't permission to access this resource",
        data: "",
      });
    }
  } else {
    return res.status(401).json({
      errCode: -1,
      errMessage: "No authenticated the user",
      data: "",
    });
  }
};
export { createJWT, verifyToken, checkUserJWT, checkUserPermission };
