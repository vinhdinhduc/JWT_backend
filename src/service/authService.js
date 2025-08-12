import { resolve } from "path";
import db from "../models/index.js";
import { Op } from "sequelize";
import bcrypt from "bcryptjs";
import { rejects } from "assert";
import { getGroupWithRole } from "./jwtService.js";
import { createJWT } from "../middleware/jwtAction.js";

const salt = bcrypt.genSaltSync(10);
let checkEmail = async (userEmail) => {
  let isEmailExist = await db.User.findOne({
    where: { email: userEmail },
  });

  if (isEmailExist) {
    return true;
  }
  return false;
};

let checkPhone = async (userPhone) => {
  let isPhoneExist = await db.User.findOne({
    where: { phoneNumber: userPhone },
  });

  if (isPhoneExist) {
    return true;
  }
  return false;
};

let hashPassword = async (password) => {
  let hash = await bcrypt.hash(password, salt);
  return hash;
};
let createNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let check = await checkEmail(data.email);

      if (check) {
        resolve({ errCode: -1, errMessage: "Email already exists" });
      }
      let checkPhoneExist = await checkPhone(data.phone);

      if (checkPhoneExist) {
        resolve({
          errCode: -1,
          errMessage: "Phone already exists",
        });
      }
      let hashPasswordUser = await hashPassword(data.password);

      await db.User.create({
        email: data.email,
        password: hashPasswordUser,
        phoneNumber: data.phone,
        address: data.address,
        gender: data.gender,
        firstName: data.firstName,
        lastName: data.lastName,
        groupId: 4,
      });
      console.log("User created successfully");

      resolve({
        errCode: 0,
        errMessage: "OK",
      });
    } catch (error) {
      reject(error);
    }
  });
};

let checkPassword = (userPassword, password) => {
  return bcrypt.compareSync(userPassword, password);
};
let loginUser = (userInfo) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: {
          [Op.or]: [
            { email: userInfo.infoValue },
            { phoneNumber: userInfo.infoValue },
          ],
        },
      });

      if (user) {
        let checkPass = checkPassword(userInfo.password, user.password);

        if (checkPass) {
          let groupWithRoles = await getGroupWithRole(user);
          let payload = {
            email: user.email,
            groupWithRoles,
            firstName: user.firstName,
            lastName: user.lastName,
          };
          let token = createJWT(payload);
          return resolve({
            errCode: 0,
            errMessage: "OK",
            data: {
              access_token: token,
              groupWithRoles,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
            },
          });
        }
      }
      return resolve({
        errCode: -1,
        errMessage:
          "Email/phone number does not exist or password is incorrect",
      });
    } catch (error) {
      console.log(error);

      reject(error);
    }
  });
};

export default { createNewUser, loginUser, checkEmail, checkPhone };
