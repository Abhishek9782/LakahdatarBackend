const User = require("../../models/UserSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const apiresponse = require("../../utility/apirespone");
const EmailTemplate = require("../../models/emailTemplate");
const { sendEmail } = require("../../utility/function");
const {
  USER,
  ERROR,
  PRODUCT,
  SUCCESS,
  ADMIN,
} = require("../../utility/messages");

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (user && user.email === email.toLocaleLowerCase()) {
      const isMatchPassword = await bcrypt.compare(password, user.password);
      if (isMatchPassword) {
        if (user.role == "admin") {
          let data = await jwt.sign(
            { _id: user._id },
            process.env.ADMIN_JWT_SECRET_KEY,
            { expiresIn: `${process.env.ADMIN_TOKEN_EXPIRE}` }
          );
          return apiresponse.successResponsewithData(
            res,
            USER.loginSuccess,
            data
          );
        } else {
          return apiresponse.errorResponse(res, USER.notAdmin);
        }
      } else {
        return apiresponse.errorResponse(res, USER.passwordwrong);
      }
    } else {
      return apiresponse.errorResponse(res, USER.notFound);
    }
  } catch (error) {
    console.log(error);
    return apiresponse.errorResponse(res, ERROR.somethingWentWrong);
  }
};

//  Work on Otp Expire-----------------------
exports.forgotPassword = async (req, res) => {
  try {
    if (req.body.email) req.body.email = req.body.email.toLowerCase();
    const { email } = req.body;
    let regexPattern = new RegExp(
      "^" + email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$",
      "i"
    );

    const user = await User.findOne({
      email: regexPattern,
    });
    if (!user) {
      apiresponse.errorResponse(res, USER.notFound);
    }
    let otp = Math.floor(Math.random() * 999999);
    let resePasswrdToken = new String(otp).padStart(6, "0");
    let ExpireToken = Date.now() + 5 * 60 * 1000; // fro 5 minutes

    // set user's db otp and expire
    const updateduser = await User.updateOne(
      { email: regexPattern },
      { otp: resePasswrdToken, otpExpires: ExpireToken }
    );

    //  search templates
    const emailTemplate = await EmailTemplate.findOne({
      slug: { $regex: "admin-password-reset" },
    });
    let content;

    content = emailTemplate.content.replace("{admin}", user.fullname);
    let link = `${process.env.ADMIN_RESET_PASSWORD_LINK}/${resePasswrdToken}`;
    content = content.replace("{link}", link);
    const options = {
      email: user.email,
      subject: emailTemplate.subject,
      message: content,
    };
    sendEmail(options);
    apiresponse.successResponse(
      res,
      "We Sent A Reset Password Link On Your Mail Id "
    );
  } catch (error) {
    apiresponse.errorResponse(res, ERROR.somethingWentWrong);
  }
};

exports.VerifyOtp = async (req, res) => {
  try {
    const { otp, email } = req.body;
    if (!email) {
      apiresponse.errorResponse(res, "Email should be required");
      return;
    }
    let regexPattern;
    if (email) {
      regexPattern = new RegExp(
        "^" + email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$",
        "i"
      );
    }
    // search us user
    const user = await User.findOne({ role: "admin", email: regexPattern });
    console.log(user);
    if (!user) {
      apiresponse.errorResponse(res, "Please Enter a Valid Email Id ");
      return;
    }
    if (user.otp !== otp) {
      apiresponse.errorResponse(res, "Please Enter a valid otp");
      return;
    }
    if (user.otpExpires < new Date(Date.now())) {
      apiresponse.errorResponse(res, "Otp Expire ");
      return;
    }
    await User.updateOne(
      { role: "admin", email: regexPattern },
      { otp: null, otpExpires: null }
    );
    apiresponse.successResponse(res, "Otp Verification SuccessFully.");
  } catch (err) {
    apiresponse.serverError(res, ERROR.somethingWentWrong);
  }
};

// const createAdmin = async (req, res) => {
//   let expireDate = new Date() + 5 * 60 * 1000;
//   const hashPassword = await bcrypt.hashSync("123456", 10);
//   await User.create({
//     fullname: "Abhishek Mishra",
//     email: "abhishekjpr123@gmail.com",
//     mobile: 9782631945,
//     password: hashPassword,
//     otp: "1234",
//     otpExpires: expireDate,
//     otpVerified: false,
//     role: "admin",
//   });
// };
// createAdmin();
const data2 = bcrypt.hashSync("123456", 10);
console.log(data2);
