import db from "../models/index.js";
import bcrypt from "bcryptjs";

const salt = 10;
let hashPassword = async (userPassword) => {
  const hash = await bcrypt.hash(userPassword, salt);
  return hash;
};
let createNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPass = await hashPassword(data.password);

      await db.User.create({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: hashPass,
        address: data.address,
        gender: data.gender,
        phoneNumber: data.phoneNumber,
      });

      resolve({
        errCode: 0,
        errMessage: "Ok",
      });
    } catch (error) {
      reject(error);
    }
  });
};

export default { createNewUser };
