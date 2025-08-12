import { where } from "sequelize";
import db from "../models/index.js";
import authService from "./authService.js";
import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);

let hashPassword = async (password) => {
  let hash = await bcrypt.hash(password, salt);
  return hash;
};
const getAllUsers = async () => {
  try {
    let users = await db.User.findAll({
      attributes: [
        "id",
        "firstName",
        "lastName",
        "email",
        "address",
        "gender",
        "phoneNumber",
      ],
      include: [{ model: db.Group, attributes: ["name", "description"] }],
    });
    return {
      errCode: 0,
      errMessage: "ok",
      data: users,
    };
  } catch (error) {
    console.log("error from service", error);

    return {
      errCode: -1,
      errMessage: "get all user error",
    };
  }
};

const getUserWithPagination = async (page, limit) => {
  try {
    let offset = (page - 1) * limit;

    const { count, rows } = await db.User.findAndCountAll({
      offset: offset,
      limit: limit,

      attributes: [
        "id",
        "firstName",
        "lastName",
        "email",
        "address",
        "gender",
        "phoneNumber",
      ],
      include: [{ model: db.Group, attributes: ["name", "description", "id"] }],
    });

    let totalPages = Math.ceil(count / limit);
    let data = {
      totalRows: count,
      totalPages: totalPages,
      users: rows,
    };

    return {
      errCode: 0,
      errMessage: "Ok",
      data: data,
    };
  } catch (error) {
    console.log(error);

    return {
      errCode: -1,
      errMessage: "Error get user pagination!",
    };
  }
};
const createUser = async (data) => {
  try {
    let checkEmail = await authService.checkEmail(data.email);
    let checkPhone = await authService.checkPhone(data.phoneNumber);

    if (checkEmail) {
      return {
        errCode: -1,
        errMessage: "Email is already exist",
      };
    }
    if (checkPhone) {
      return {
        errCode: -1,
        errMessage: "Phone is already exist",
      };
    }
    let hashPass = await hashPassword(data.password);
    await db.User.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hashPass,
      address: data.address,
      gender: data.gender,
      phoneNumber: data.phoneNumber,
      groupId: data.groupId,
    });

    return {
      errCode: 0,
      errMessage: "Create new user succeed!",
    };
  } catch (error) {
    console.log("error service createUser", error);
    return {
      errCode: -1,
      errMessage: "create user error",
    };
  }
};
const editUser = async (data) => {
  try {
    await db.User.update(
      {
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        gender: data.gender,
        groupId: data.groupId,
        phoneNumber: data.phoneNumber,
      },
      {
        where: { id: data.id },
      }
    );
    return {
      errCode: 0,
      errMessage: "Update user succeed!",
    };
  } catch (error) {
    console.log("error service editUser", error);
    return {
      errCode: -1,
      errMessage: "edit user error",
    };
  }
};
const deleteUser = async (id) => {
  try {
    let user = await db.User.findOne({
      where: { id: id },
    });

    if (user) {
      await user.destroy();
      return {
        errCode: 0,
        errMessage: "Delete user succeed!",
      };
    } else {
      return {
        errCode: 0,
        errMessage: "Delete user error!",
      };
    }
  } catch (error) {
    console.log("error service deleteUser", error);
    return {
      errCode: -1,
      errMessage: "delete user error",
    };
  }
};

export default {
  getAllUsers,
  editUser,
  createUser,
  deleteUser,
  getUserWithPagination,
};
