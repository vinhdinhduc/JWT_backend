import db from "../models/index.js";

const getGroup = async () => {
  try {
    let data = await db.Group.findAll({
      order: [["name", "ASC"]],
    });
    return {
      errCode: 0,
      errMessage: "Get group success",
      data: data,
    };
  } catch (error) {
    console.log("error from service", error);

    return {
      errCode: -1,
      errMessage: "get group user error",
    };
  }
};

const getRoleByGroup = async (id) => {
  try {
    let data = await db.Group.findOne({
      where: { id: id },
      attributes: ["id", "name", "description"],
      include: [
        {
          model: db.Role,
          attributes: ["id", "url", "description"],
          through: { attributes: [] },
        },
      ],
    });
    return {
      errCode: 0,
      errMessage: "Get role by group success",
      data: data,
    };
  } catch (error) {
    console.log("error from service", error);
    return {
      errCode: -1,
      errMessage: "get role by group error",
    };
  }
};

export default { getGroup, getRoleByGroup };
