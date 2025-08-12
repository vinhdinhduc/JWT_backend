import authServices from "../service/authService.js";

let registerUser = async (req, res) => {
  try {
    if (
      !req.body.email ||
      !req.body.password ||
      !req.body.firstName ||
      !req.body.lastName ||
      !req.body.phone
    ) {
      return res.status(400).json({
        errCode: -1,
        errMessage: "Missing require parameter!",
      });
    }
    let data = await authServices.createNewUser(req.body);

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);

    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server!",
    });
  }
};
let loginUser = async (req, res) => {
  try {
    if (!req.body.infoValue || !req.body.password) {
      return res.status(200).json({
        errCode: -1,
        errMessage: "Missing require parameter!",
      });
    }

    let data = await authServices.loginUser(req.body);

    if (data && data.errCode === 0) {
      res.cookie("jwt", data.data.access_token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
      });
    }
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);

    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server!",
    });
  }
};
let logOutUser = async (req, res) => {
  try {
    res.clearCookie("jwt");
    return res.status(200).json({
      errCode: 0,
      errMessage: "Logout successful",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server!",
    });
  }
};

export default { registerUser, loginUser, logOutUser };
