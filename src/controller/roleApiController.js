import roleApiService from "../service/roleApiService.js";
const showRole = async (req, res) => {
  try {
    if (req.query.page && req.query.limit) {
      let page = req.query.page;
      let limit = req.query.limit;

      let data = await roleApiService.getRoleWithPagination(+page, +limit);
      return res.status(200).json(data);
    } else {
      let data = await roleApiService.getAllRole();
      return res.status(200).json(data);
    }
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server!",
    });
  }
};
const createRole = async (req, res) => {
  try {
    let data = await roleApiService.createRole(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server!",
    });
  }
};
const updateRole = async (req, res) => {
  try {
    let data = await roleApiService.editRole(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server!",
    });
  }
};
const deleteRole = async (req, res) => {
  try {
    console.log("deleteRole called", req.params.id);

    let data = await roleApiService.deleteRole(req.params.id);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server!",
    });
  }
};

export default { deleteRole, updateRole, createRole, showRole };
