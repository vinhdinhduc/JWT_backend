import db from "../models/index.js";

const getAllRole = async () => {
  try {
    let roles = await db.Role.findAll({
      attributes: ["id", "url", "description"],
    });

    if (roles) {
      return {
        errCode: 0,
        errMessage: "ok",
        data: roles,
      };
    }
  } catch (error) {
    console.log("error from service", error);
    return {
      errCode: -1,
      errMessage: "get all role error",
    };
  }
};
const getRoleWithPagination = async (page, limit) => {
  try {
    let offset = (page - 1) * limit;
    const { count, rows } = await db.Role.findAndCountAll({
      offset: offset,
      limit: limit,
      attributes: ["id", "url", "description"],
    });
    let totalPages = Math.ceil(count / limit);
    let data = {
      totalRows: count,
      totalPages: totalPages,
      roles: rows,
    };
    return {
      errCode: 0,
      errMessage: "Ok",
      data: data,
    };
  } catch (error) {
    console.log("error from service", error);
    return {
      errCode: -1,
      errMessage: "get role with pagination error",
    };
  }
};
const createRole = async (data) => {
  try {
    if (
      !Array.isArray(data) ||
      data.length === 0 ||
      data.some((item) => !item.url)
    ) {
      return {
        errCode: 1,
        errMessage: "Missing required parameter",
      };
    }

    const urls = data.map((item) => item.url.trim());

    const existingRole = await db.Role.findAll({
      where: {
        url: urls,
      },
      attributes: ["url"],
    });
    const existingUrls = existingRole.map((r) => r.url);

    const newRole = data
      .filter((item) => !existingUrls.includes(item.url))
      .map((item) => ({
        url: item.url,
        description: item.description || "",
      }));

    if (newRole.length === 0) {
      return {
        errCode: 2,
        errMessage: "Role already exists",
      };
    }
    let createdRoles = await db.Role.bulkCreate(newRole, {
      validator: true,
    });

    return {
      errCode: 0,
      errMessage: `Add ${createdRoles.length} roles successfully`,
    };
  } catch (error) {
    console.log("error from service", error);
    return {
      errCode: -1,
      errMessage: "create role error",
    };
  }
};
const editRole = async (data) => {
  try {
    console.log("editRole called", data.data[0].url);
    if (!data.id || !data.data[0].url) {
      return {
        errCode: 1,
        errMessage: "Missing required parameter",
      };
    }
    let role = await db.Role.findOne({
      where: { id: data.id },
    });
    if (!role) {
      return {
        errCode: 2,
        errMessage: "Role not found",
      };
    }
    role.url = data.data[0].url;
    role.description = data.data[0].description || "";
    await role.save();
    return {
      errCode: 0,
      errMessage: "Role updated successfully",
    };
  } catch (error) {
    console.log("error from service", error);
    return {
      errCode: -1,
      errMessage: "edit role error",
    };
  }
};
const deleteRole = async (id) => {
  try {
    if (!id) {
      return {
        errCode: 1,
        errMessage: "Missing required parameter",
      };
    }
    let role = await db.Role.findOne({
      where: { id: id },
    });
    if (!role) {
      return {
        errCode: 2,
        errMessage: "Role not found",
      };
    }
    await db.Role.destroy({
      where: { id: id },
    });
    return {
      errCode: 0,
      errMessage: "Role deleted successfully",
    };
  } catch (error) {
    console.log("error from service", error);
    return {
      errCode: -1,
      errMessage: "delete role error",
    };
  }
};

export default {
  getAllRole,
  getRoleWithPagination,
  createRole,
  editRole,
  deleteRole,
};
