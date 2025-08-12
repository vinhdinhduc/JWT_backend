import db from "../models/index.js";

const getGroupWithRole = async (user) => {
  let roles = await db.Group.findOne({
    where: { id: user.GroupId },
    attributes: ["id", "name", "description"],

    include: {
      model: db.Role,
      attributes: ["id", "url", "description"],
      through: { attributes: [] },
    },
  });
  return roles;
};

export { getGroupWithRole };
