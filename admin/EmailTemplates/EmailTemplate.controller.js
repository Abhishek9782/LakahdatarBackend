const asyncHandler = require("express-async-handler");

const {
  errorResponse,
  successResponsewithData,
  successResponse,
} = require("../../utility/apirespone");
const { ERROR, ADMIN, EMAILTEMPLATE } = require("../../utility/messages");
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
  successResponse(res, "Data founded...");
  try {
  } catch (err) {
    return next({ statusCode: 400, message: ERROR.somethingWentWrong });
  }
});
