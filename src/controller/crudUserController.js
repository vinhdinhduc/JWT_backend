import userApiService from "../service/userApiService.js";
const showUser = async (req, res) => {
  try {
    if (req.query.page && req.query.limit) {
      let page = req.query.page;
      let limit = req.query.limit;

      let data = await userApiService.getUserWithPagination(+page, +limit);
      return res.status(200).json(data);
    } else {
      let data = await userApiService.getAllUsers();
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
const createUser = async (req, res) => {
  try {
    let data = await userApiService.createUser(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server!",
    });
  }
};
const updateUser = async (req, res) => {
  try {
    let data = await userApiService.editUser(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server!",
    });
  }
};
const deleteUser = async (req, res) => {
  try {
    let data = await userApiService.deleteUser(req.body.id);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server!",
    });
  }
};

const getUserAccount = (req, res) => {
  console.log("getUserAccount called", req.user);

  return res.status(200).json({
    errCode: 0,
    errMessage: "Ok",
    data: {
      access_token: req.token,
      groupWithRoles: req.user?.groupWithRoles,
      email: req.user?.email,
      firstName: req.user?.firstName,
      lastName: req.user?.lastName,
    },
  });
};
export default { deleteUser, createUser, showUser, updateUser, getUserAccount };
