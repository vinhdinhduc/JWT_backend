import userService from "../service/userService.js";

let createNewUser = async (req, res) => {
  try {
    let data = await userService.createNewUser(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.log("error", error);

    return res.status(200).json({
      errCode: 1,
      errMessage: "Error from server",
    });
  }
};

export default { createNewUser };
