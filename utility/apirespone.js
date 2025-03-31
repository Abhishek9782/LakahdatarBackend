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
  return res.status(400).json(dt);
};

const serverError = (req, msg) => {
  const dt = {
    status: 0,
    message: msg,
  };
  return res.status(500).json(dt);
};
module.exports = {
  successResponse,
  successResponsewithData,
  errorResponse,
  serverError,
};
