import groupService from "../service/groupService.js";

const getGroupFunc = async (req, res) => {
  try {
    let data = await groupService.getGroup();
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server!",
    });
  }
};

const getRoleByGroup = async (req, res) => {
  try {
    if (!req.params.groupId) {
      return res.status(400).json({
        errCode: 1,
        errMessage: "Missing required parameter: groupId",
      });
    }
    let data = await groupService.getRoleByGroup(req.params.groupId);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server!",
    });
  }
};

export default { getGroupFunc, getRoleByGroup };
