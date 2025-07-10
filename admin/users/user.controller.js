const User = require("../../models/UserSchema");
const apiResponse = require("../../utility/apirespone");
const { ERROR, AUTH, SUCCESS, USER } = require("../../utility/messages");
const getAllusers = async (req, res) => {
  try {
    if (!req.user) {
      return apiResponse.AuthError(res, AUTH.notAuth);
    }
    let { pageNumber, pageSize } = req.query;
    pageNumber = Number.parseInt(pageNumber - 1);
    pageSize = Number.parseInt(pageSize);
    let skip = pageSize * pageNumber;

    const users = await User.find(
      { role: "user" },
      {
        fullname: 1,
        email: 1,
        img: 1,
        createdAt: 1,
        updatedAt: 1,
        mobile: 1,
        status: 1,
        role: 1,
      }
    )
      .lean()
      .skip(skip)
      .limit(pageSize);
    return apiResponse.successResponsewithData(res, SUCCESS.dataFound, users);
  } catch (err) {
    return apiResponse.serverError(res, ERROR.somethingWentWrong);
  }
};

const changeUserStatus = async (req, res) => {
  try {
    const { id, status } = req.query;

    const isuserUpdated = await User.findByIdAndUpdate(
      id,
      { status: Number.parseInt(status) },
      { new: true }
    );
    return apiResponse.successResponse(res, USER.userStatusUpdated);
  } catch (err) {
    console.log(err);
    return apiResponse.serverError(res, ERROR.somethingWentWrong);
  }
};

module.exports = { getAllusers, changeUserStatus };
