const {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
} = require("./errors");
const successResponse = (res, msg) => {
  const dt = {
    status: 1,
    message: msg,
  };
  console.log(dt);
  return res.status(200).json(dt);
};

const successResponsewithData = (res, msg, data) => {
  const dt = {
    status: 1,
    message: msg,
    data: data,
  };
  return res.status(200).json(dt);
};

const errorResponse = (res, msg) => {
  const dt = {
    status: 0,
    message: msg,
  };
  return res.status(BAD_REQUEST).json(dt);
};

const serverError = (res, msg) => {
  const dt = {
    status: 0,
    message: msg,
  };
  return res.status(INTERNAL_SERVER_ERROR).json(dt);
};

const AuthError = (res, msg) => {
  const dt = {
    status: 0,
    message: msg,
  };
  return res.status(UNAUTHORIZED).json(dt);
};
module.exports = {
  successResponse,
  successResponsewithData,
  errorResponse,
  serverError,
  AuthError,
};
