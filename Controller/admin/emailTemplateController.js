const asyncHandler = require("express-async-handler");

const {
  errorResponse,
  successResponsewithData,
  successResponse,
  serverError,
} = require("../../utility/apirespone");
const {
  ERROR,
  ADMIN,
  EMAILTEMPLATE,
  SUCCESS,
} = require("../../utility/messages");
const EmailTemplate = require("../../models/emailTemplate");

exports.AddTemplate = async (req, res) => {
  try {
    const userType = req.user.role;
    const { title, subject, content } = req.body;

    ("<p>Dear {admin}this Email is from Lakhdatar Restaurant and here is Your Password Reset Link Please<a href=''>Click Here </a> and Change Your Password <br /><br />Thank You </p>");
    if (userType === "admin") {
      const regex = /[`~!@#$%^&*()_+=\-[\]{};:'",.<>?/\\|]/g;
      let str = title.replace(regex, "");
      let slug = str.toLowerCase().replaceAll(" ", "-");

      let isAlreadytemplate = await EmailTemplate.findOne({ slug: slug });
      if (!isAlreadytemplate) {
        let data = await EmailTemplate.create({
          title: title,
          subject: subject,
          content: content,
          slug: slug,
        });
        successResponsewithData(res, EMAILTEMPLATE.templateadd);
      } else {
        errorResponse(res, EMAILTEMPLATE.alreadyExist);
      }
    } else {
      errorResponse(res, ADMIN.notAdmin);
    }
  } catch (error) {
    console.log(error);
    errorResponse(res, ERROR.somethingWentWrong);
  }
};

exports.getAllTemplate = asyncHandler(async (req, res, next) => {
  try {
    let { pageNumber, pageSize } = req.query;
    pageNumber = Math.max(0, pageNumber - 1);
    let skip = pageNumber * pageSize;

    const allEmailTemplate = await EmailTemplate.find({}, { __v: 0 })
      .skip(skip)
      .limit(pageSize);
    return successResponsewithData(res, SUCCESS.dataFound, allEmailTemplate);
  } catch (err) {
    return next({ statusCode: 400, message: ERROR.somethingWentWrong });
  }
});

exports.deleteTemplate = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const updatedEmailTemplate = await EmailTemplate.findByIdAndUpdate(
      id,
      {
        status: 2,
      },
      { new: true }
    );
    return successResponse(res, EMAILTEMPLATE.TemplateDeleted);
  } catch (err) {
    console.log(err);
    return serverError(res, ERROR.somethingWentWrong);
  }
});

// working on it
// exports.updateTemplate = asyncHandler(async (req, res) => {
//   try {
//     const id = req.params.id;
//     const { title, content } = req.body;
//     const updatedEmailTemplate = await EmailTemplate.findByIdAndUpdate(
//       id,
//       req.body,
//       { new: true }
//     );
//     return successResponse(res, EMAILTEMPLATE.templateupdated);
//   } catch (err) {
//     return serverError(res, ERROR.somethingWentWrong);
//   }
// });
